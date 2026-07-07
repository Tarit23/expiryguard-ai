import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Html5QrcodeScanner } from 'html5-qrcode';

const Inwarding = () => {
  const [latestLog, setLatestLog] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannerError, setScannerError] = useState(null);

  const fetchData = async () => {
    try {
      const logsRes = await axios.get('/api/inwarding');
      if (logsRes.data && logsRes.data.length > 0) {
        setLatestLog(logsRes.data[0]);
      }
      const metricsRes = await axios.get('/api/metrics');
      setMetrics(metricsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Initialize Scanner on mount
    const scanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.777778 },
      /* verbose= */ false
    );

    scanner.render(
      async (decodedText) => {
        // Success callback
        setIsScanning(false);
        scanner.pause(); // Pause scanning after successful detection
        
        try {
          // Process the scan (simulate extracting SKU and batch from barcode text)
          // For prototype, we use the decodedText directly or fallback to random
          const parsedSku = decodedText.includes('-') ? decodedText : `SKU-${decodedText.substring(0,4).toUpperCase()}-AUTO`;
          
          await axios.post('/api/inwarding', {
            sku: parsedSku,
            batchCode: 'LOT: ' + Math.random().toString(36).substring(7).toUpperCase(),
            expiryDate: new Date(Date.now() + 1000*60*60*24*30).toISOString(),
            confidenceScore: (Math.random() * (99.9 - 95.0) + 95.0).toFixed(1)
          });
          
          await fetchData();
          
          // Resume scanning after 3 seconds automatically
          setTimeout(() => {
            setLatestLog(null);
            setIsScanning(true);
            scanner.resume();
          }, 3000);

        } catch (err) {
          console.error("Scan processing error", err);
          setIsScanning(true);
          scanner.resume();
        }
      },
      (error) => {
        // We can ignore frame errors, as it throws an error every frame a QR code is not detected
      }
    );

    // Cleanup scanner on unmount
    return () => {
      scanner.clear().catch(error => console.error("Failed to clear html5QrcodeScanner. ", error));
    };
  }, []);

  const updateStatus = async (status) => {
    if (!latestLog) return;
    try {
      await axios.put(`/api/inwarding/${latestLog.id}/status`, { status });
      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="p-md grid grid-cols-12 gap-md max-w-container-max mx-auto w-full">
        {/* LIVE SCAN INTERFACE */}
        <section className="col-span-12 lg:col-span-8 flex flex-col space-y-md">
          <div className="bg-white rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-sm">
            <div className="px-md py-sm border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <div className="flex items-center space-x-xs">
                <span className={`w-2 h-2 rounded-full ${isScanning ? 'bg-error animate-pulse' : 'bg-success'}`}></span>
                <span className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
                  {isScanning ? 'Live AI Inwarding Stream' : 'Scan Processed'}
                </span>
              </div>
              <div className="flex space-x-xs">
                <span className="px-xs py-1 rounded bg-surface-container-highest font-label-sm text-label-sm">MOBILE_CAM</span>
                <span className="px-xs py-1 rounded bg-surface-container-highest font-label-sm text-label-sm">AUTO_DETECT</span>
              </div>
            </div>
            
            {/* THE VIEWFINDER */}
            <div className="relative bg-black group overflow-hidden min-h-[400px] flex flex-col">
              
              {/* html5-qrcode container */}
              <div id="reader" className={`w-full ${!isScanning ? 'opacity-30' : 'opacity-100'}`} style={{ border: 'none' }}></div>
              
              {/* Scan Overlays */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="absolute top-10 left-10 w-12 h-12 border-t-4 border-l-4 border-primary shadow-lg"></div>
                <div className="absolute top-10 right-10 w-12 h-12 border-t-4 border-r-4 border-primary shadow-lg"></div>
                <div className="absolute bottom-24 left-10 w-12 h-12 border-b-4 border-l-4 border-primary shadow-lg"></div>
                <div className="absolute bottom-24 right-10 w-12 h-12 border-b-4 border-r-4 border-primary shadow-lg"></div>
                
                {isScanning && <div className="scanning-line absolute left-10 right-10 h-1 bg-primary/80 shadow-[0_0_20px_rgba(37,99,235,1)]"></div>}
              </div>
              
              {/* Viewfinder Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-md glass-panel flex justify-between items-end border-t border-white/20 z-20">
                <div className="space-y-1">
                  <div className="text-primary font-bold text-headline-md font-headline-md tracking-tight drop-shadow-md">
                    {latestLog && !isScanning ? `OBJECT DETECTED: ${latestLog.product?.sku || latestLog.productId}` : 'AWAITING PRODUCT...'}
                  </div>
                  <div className="text-white font-label-md text-label-md drop-shadow-md">
                    {isScanning ? 'Status: Point camera at barcode to auto-scan' : `Status: Extracted & Logged Successfully`}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* ANOMALY DETECTION PANEL */}
          {latestLog?.status === 'REJECTED' && (
            <div className="bg-error-container/30 border border-error/20 rounded-xl p-md flex items-start space-x-md">
              <div className="bg-error rounded-full p-2 text-white">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <div className="flex-grow">
                <h3 className="font-headline-md text-headline-md text-on-error-container">Batch Rejected</h3>
                <p className="font-body-md text-body-md text-on-error-container opacity-80">Manual rejection applied to Batch #{latestLog.batchCode}. Recommended action: Physical Inspection.</p>
              </div>
              <button className="bg-error/10 hover:bg-error/20 text-error border border-error/30 px-md py-2 rounded-lg font-label-md text-label-md transition-colors">
                FLAG BATCH
              </button>
            </div>
          )}
        </section>

        {/* EXTRACTION & DATA PANEL */}
        <section className="col-span-12 lg:col-span-4 flex flex-col space-y-md">
          {/* CONFIDENCE GAUGE CARD */}
          <div className="bg-white rounded-xl border border-outline-variant p-md shadow-sm">
            <div className="flex justify-between items-center mb-md">
              <h2 className="font-headline-md text-headline-md">AI Confidence</h2>
              <span className="material-symbols-outlined text-outline">info</span>
            </div>
            <div className="flex flex-col items-center justify-center py-sm">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle className="text-surface-container-highest" cx="80" cy="80" fill="none" r="70" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-primary confidence-ring" cx="80" cy="80" fill="none" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset={440 - (440 * (latestLog?.confidenceScore || 0)) / 100} strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-headline-xl font-headline-xl text-primary">{latestLog?.confidenceScore || 0}%</span>
                  <span className="text-label-md font-label-md text-on-surface-variant uppercase tracking-tighter">Verified</span>
                </div>
              </div>
              <p className="text-center font-body-md text-body-md text-on-surface-variant mt-md">System is highly confident in the extracted data and product alignment.</p>
            </div>
          </div>

          {/* OCR EXTRACTION RESULTS */}
          <div className="bg-white rounded-xl border border-outline-variant flex flex-col shadow-sm flex-grow">
            <div className="px-md py-sm border-b border-outline-variant bg-surface-bright flex justify-between items-center">
              <h2 className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant">Extracted Data</h2>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${latestLog?.status === 'APPROVED' ? 'bg-secondary-container text-on-secondary-container' : latestLog?.status === 'REJECTED' ? 'bg-error-container text-error' : 'bg-surface-variant text-on-surface'}`}>
                {latestLog?.status || 'NO DATA'}
              </span>
            </div>
            <div className="p-md space-y-md">
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Product SKU</label>
                <div className="flex items-center justify-between group">
                  <span className="font-headline-md text-headline-md text-on-surface">{latestLog?.product?.sku || latestLog?.productId || '---'}</span>
                </div>
              </div>
              <div className="h-px bg-outline-variant"></div>
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Expiry Date</label>
                <div className="flex items-center justify-between group">
                  <span className="font-headline-md text-headline-md text-error">{latestLog ? new Date(latestLog.expiryDate).toLocaleDateString() : '---'}</span>
                </div>
              </div>
              <div className="h-px bg-outline-variant"></div>
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Batch Code</label>
                <div className="flex items-center justify-between group">
                  <span className="font-headline-md text-headline-md text-on-surface">{latestLog?.batchCode || '---'}</span>
                </div>
              </div>
              <div className="h-px bg-outline-variant"></div>
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Source Origin</label>
                <div className="flex items-center justify-between">
                  <span className="font-headline-md text-headline-md text-on-surface">{latestLog?.product?.supplier || 'Auto-Detected'}</span>
                  <span className="material-symbols-outlined text-outline">public</span>
                </div>
              </div>
            </div>
            
            {/* ACTION BUTTONS */}
            <div className="mt-auto p-md bg-surface-container-low/50 grid grid-cols-2 gap-sm">
              <button 
                onClick={() => updateStatus('APPROVED')}
                disabled={!latestLog || latestLog.status === 'APPROVED'}
                className="bg-secondary disabled:opacity-50 text-white py-3 rounded-lg font-headline-md text-headline-md flex items-center justify-center space-x-2 shadow-sm hover:bg-on-secondary-container transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">check_circle</span>
                <span>APPROVE</span>
              </button>
              <button 
                onClick={() => updateStatus('REJECTED')}
                disabled={!latestLog || latestLog.status === 'REJECTED'}
                className="bg-white disabled:opacity-50 text-error border border-error/30 py-3 rounded-lg font-headline-md text-headline-md flex items-center justify-center space-x-2 hover:bg-error-container/20 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined">cancel</span>
                <span>REJECT</span>
              </button>
            </div>
          </div>
        </section>

        {/* MINI METRICS FOOTER */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
          <div className="bg-white border border-outline-variant p-md rounded-xl shadow-sm flex items-center space-x-md">
            <div className="p-3 bg-primary/10 text-primary rounded-lg">
              <span className="material-symbols-outlined">inventory_2</span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-outline uppercase">Shift Volume</div>
              <div className="font-headline-md text-headline-md">{metrics?.totalScanned || 0} Units</div>
            </div>
          </div>
          <div className="bg-white border border-outline-variant p-md rounded-xl shadow-sm flex items-center space-x-md">
            <div className="p-3 bg-secondary/10 text-secondary rounded-lg">
              <span className="material-symbols-outlined">speed</span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-outline uppercase">Avg. Scan Time</div>
              <div className="font-headline-md text-headline-md">0.4s / unit</div>
            </div>
          </div>
          <div className="bg-white border border-outline-variant p-md rounded-xl shadow-sm flex items-center space-x-md">
            <div className="p-3 bg-tertiary-container/10 text-tertiary rounded-lg">
              <span className="material-symbols-outlined">priority_high</span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-outline uppercase">Rejected Today</div>
              <div className="font-headline-md text-headline-md">{metrics?.totalRejected || 0} Flagged</div>
            </div>
          </div>
          <div className="bg-white border border-outline-variant p-md rounded-xl shadow-sm flex items-center space-x-md">
            <div className="p-3 bg-on-background/10 text-on-background rounded-lg">
              <span className="material-symbols-outlined">monitoring</span>
            </div>
            <div>
              <div className="font-label-md text-label-md text-outline uppercase">AI Uptime</div>
              <div className="font-headline-md text-headline-md">{metrics?.aiUptime || '100'}%</div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Inwarding;
