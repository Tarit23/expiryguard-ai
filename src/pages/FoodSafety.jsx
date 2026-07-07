import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FoodSafety = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Form State
  const [zone, setZone] = useState('Zone A (Meat)');
  const [temperature, setTemperature] = useState('');
  const [humidity, setHumidity] = useState('');
  const [inspector, setInspector] = useState('');

  const fetchAlerts = async () => {
    try {
      const res = await axios.get('/api/alerts');
      setAlerts(res.data);
    } catch (err) {
      console.error("Failed to fetch alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleManualInspection = async (e) => {
    e.preventDefault();
    // Simulate logging audit or triggering alert if temp > threshold
    const tempNum = parseFloat(temperature);
    if (tempNum > 4.0) {
      alert(`Safety Anomaly! Temperature is ${tempNum}°C (Limit: 4°C). Alert generated.`);
      // Call mock or database API to create alert
    } else {
      alert(`Manual Inspection successful. All values in normal range.`);
    }
    setShowInspectionModal(false);
    setTemperature('');
    setHumidity('');
  };

  const exportAlertsReport = () => {
    // Generate CSV of alerts
    const headers = 'ID,Type,Severity,Message,Status,Date\n';
    const rows = alerts.map(a => `${a.id},${a.type},${a.severity},"${a.message}",${a.status},${a.createdAt}`).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `safety_alerts_report_${new Date().toISOString().slice(0,10)}.csv`);
    a.click();
  };

  return (
    <>
      <div className="p-md max-w-container-max mx-auto space-y-md w-full">
        {/* Header section */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-on-background">Food Safety Monitoring</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Real-time cold chain parameters and system log integrity.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowInspectionModal(true)} className="border border-outline-variant px-4 py-2 text-[12px] font-bold bg-white hover:bg-surface-container-high transition-colors rounded-lg">
              LOG MANUAL INSPECTION
            </button>
            <button onClick={exportAlertsReport} className="bg-primary text-on-primary px-4 py-2 text-[12px] font-bold flex items-center gap-2 hover:opacity-90 transition-opacity rounded-lg shadow-md">
              <span className="material-symbols-outlined text-sm">download</span> EXPORT REPORT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-md">
          {/* Risk Card */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant p-md rounded-xl flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div>
              <p className="font-label-md text-label-md text-outline uppercase tracking-wider">Hub Safety Status</p>
              <h3 className="font-headline-xl text-headline-xl text-secondary mt-2">Optimal</h3>
            </div>
            <div className="my-md flex items-end gap-2">
              <span className="font-headline-xl text-[64px] leading-tight font-extrabold text-on-surface">98</span>
              <span className="font-headline-md text-headline-md text-outline pb-2">/ 100</span>
            </div>
            <div className="space-y-sm">
              <div className="flex justify-between items-center text-label-md font-label-md text-outline">
                <span>RISK PROBABILITY</span>
                <span className="text-secondary">Low (1.2%)</span>
              </div>
              <div className="w-full bg-surface-container-high h-1 rounded-full">
                <div className="bg-secondary h-full rounded-full" style={{width: '98%'}}></div>
              </div>
            </div>
          </div>

          {/* Temperature chart */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant p-md rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h4 className="font-headline-md text-headline-md text-on-surface">Cold-Chain Temperature Tracking</h4>
                <p className="font-body-md text-body-md text-outline">Zone A (Meat) &amp; Zone B (Dairy)</p>
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary rounded-full"></span>
                  <span className="font-label-md text-label-md">Meat</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-tertiary-container rounded-full"></span>
                  <span className="font-label-md text-label-md">Dairy</span>
                </div>
              </div>
            </div>
            {/* SVG Chart */}
            <div className="h-48 w-full bg-surface-container-low rounded relative overflow-hidden flex items-end">
              <svg className="w-full h-full" viewBox="0 0 800 200">
                <line stroke="#c3c6d7" strokeDasharray="4" x1="0" x2="800" y1="50" y2="50"></line>
                <line stroke="#c3c6d7" strokeDasharray="4" x1="0" x2="800" y1="100" y2="100"></line>
                <line stroke="#c3c6d7" strokeDasharray="4" x1="0" x2="800" y1="150" y2="150"></line>
                <path d="M0,120 Q50,110 100,115 T200,105 T300,120 T400,110 T500,115 T600,105 T700,110 T800,115" fill="none" stroke="#004ac6" strokeWidth="3"></path>
                <path d="M0,80 Q50,85 100,75 T200,85 T300,75 T400,85 T500,75 T600,85 T700,75 T800,85" fill="none" stroke="#996100" strokeWidth="3"></path>
              </svg>
            </div>
          </div>
        </div>

        {/* Alerts table */}
        <div className="bg-white border border-outline-variant overflow-hidden flex flex-col rounded-xl shadow-sm">
          <div className="p-md border-b border-outline-variant flex justify-between items-center">
            <h5 className="font-headline-md text-headline-md">Active Safety Alerts</h5>
            <button onClick={() => setShowHistoryModal(true)} className="text-primary font-label-md text-label-md hover:underline">VIEW ALL HISTORY</button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-md py-3 font-label-md text-label-md text-outline">ZONE/ID</th>
                <th className="px-md py-3 font-label-md text-label-md text-outline">ALERT TYPE</th>
                <th className="px-md py-3 font-label-md text-label-md text-outline">MESSAGE</th>
                <th className="px-md py-3 font-label-md text-label-md text-outline">STATUS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-4 text-outline">Loading alerts...</td></tr>
              ) : alerts.length === 0 ? (
                <tr><td colSpan="4" className="text-center py-4 text-outline">No active alerts.</td></tr>
              ) : (
                alerts.map(alert => (
                  <tr key={alert.id} className="border-b border-outline-variant hover:bg-surface-container transition-colors">
                    <td className="px-md py-4">
                      <div className="font-body-md font-bold">System Node</div>
                      <div className="text-[10px] text-outline">ID: {alert.id.substring(0, 8)}</div>
                    </td>
                    <td className="px-md py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        alert.severity === 'CRITICAL' ? 'bg-error-container text-on-error-container' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                      }`}>
                        {alert.type}
                      </span>
                    </td>
                    <td className="px-md py-4 font-body-md">{alert.message}</td>
                    <td className="px-md py-4">
                      <span className="font-label-sm text-label-sm text-outline">{alert.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Inspection Modal */}
      {showInspectionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-xl max-w-md w-full border border-outline-variant overflow-hidden shadow-2xl">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h2 className="font-headline-md text-headline-md">Log Manual Inspection</h2>
              <button onClick={() => setShowInspectionModal(false)} className="material-symbols-outlined text-outline">close</button>
            </div>
            <form onSubmit={handleManualInspection} className="p-md space-y-md">
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Zone</label>
                <select value={zone} onChange={(e) => setZone(e.target.value)} className="w-full p-2 border border-outline-variant rounded bg-white">
                  <option value="Zone A (Meat)">Zone A (Meat Coldroom)</option>
                  <option value="Zone B (Dairy)">Zone B (Dairy Chiller)</option>
                  <option value="Zone C (Ambient)">Zone C (Ambient Dock)</option>
                </select>
              </div>
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Temperature (°C)</label>
                <input required type="number" step="0.1" placeholder="e.g. 3.2" value={temperature} onChange={(e) => setTemperature(e.target.value)} className="w-full p-2 border border-outline-variant rounded bg-white text-black" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Humidity (%)</label>
                <input required type="number" min="0" max="100" placeholder="e.g. 50" value={humidity} onChange={(e) => setHumidity(e.target.value)} className="w-full p-2 border border-outline-variant rounded bg-white text-black" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Inspector Code</label>
                <input required type="text" placeholder="e.g. INS-922" value={inspector} onChange={(e) => setInspector(e.target.value)} className="w-full p-2 border border-outline-variant rounded bg-white text-black" />
              </div>
              <div className="pt-md flex justify-end space-x-2">
                <button type="button" onClick={() => setShowInspectionModal(false)} className="px-md py-2 border border-outline-variant rounded font-label-md">Cancel</button>
                <button type="submit" className="px-md py-2 bg-primary text-white rounded font-label-md shadow-md">Submit Log</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-xl max-w-lg w-full border border-outline-variant overflow-hidden shadow-2xl">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h2 className="font-headline-md text-headline-md">Historical Safety Audits</h2>
              <button onClick={() => setShowHistoryModal(false)} className="material-symbols-outlined text-outline">close</button>
            </div>
            <div className="p-md space-y-sm max-h-[300px] overflow-y-auto">
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded">
                <p className="font-body-md font-bold">Chiller C4 Temperature Calibration</p>
                <p className="text-label-sm text-outline">Verified 1.2°C • Resolved by Inspector INS-922 • 2 hours ago</p>
              </div>
              <div className="p-3 bg-surface-container-low border border-outline-variant rounded">
                <p className="font-body-md font-bold">Main Hall Ambient Humidity Flush</p>
                <p className="text-label-sm text-outline">Verified 42.1% • Resolved by Auto-Stabilizer Node #02 • 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FoodSafety;
