import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Freshness = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('ALL'); // ALL, CRITICAL, STABLE, FRESH
  const [showLogModal, setShowLogModal] = useState(false);
  
  // Form State
  const [sku, setSku] = useState('SKU-8842-DAIRY');
  const [batchCode, setBatchCode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(95);

  const fetchLogs = async () => {
    try {
      const res = await axios.get('/api/inwarding');
      setLogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleLogShipment = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/inwarding', {
        sku,
        batchCode: 'LOT: ' + batchCode,
        expiryDate: new Date(expiryDate).toISOString(),
        confidenceScore: parseFloat(confidenceScore)
      });
      setShowLogModal(false);
      fetchLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const getDaysLeft = (expiryDate) => {
    const diff = new Date(expiryDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days;
  };

  const reprioritizeBatch = (id) => {
    alert(`Batch ${id.substring(0, 8)} reprioritized to high priority FEFO dispatch!`);
  };

  const filteredLogs = logs.filter(log => {
    const days = getDaysLeft(log.expiryDate);
    if (filterType === 'CRITICAL') return days <= 5 && days > 0;
    if (filterType === 'FRESH') return days > 10;
    if (filterType === 'STABLE') return days > 5 && days <= 10;
    return true;
  });

  return (
    <>
      <div className="p-md max-w-[1440px] mx-auto">
        {/* Header Section */}
        <div className="mb-lg">
          <div className="flex justify-between items-end mb-md">
            <div>
              <p className="font-label-md text-label-md text-primary uppercase tracking-wider">Operational Health</p>
              <h3 className="font-headline-xl text-headline-xl text-on-surface">Freshness Scores</h3>
            </div>
            <div className="flex gap-xs">
              <select 
                value={filterType} 
                onChange={(e) => setFilterType(e.target.value)} 
                className="px-sm py-2 border border-outline-variant rounded-lg text-label-md bg-white hover:bg-surface-container-high transition-all"
              >
                <option value="ALL">All Batches</option>
                <option value="CRITICAL">Critical (&lt;5 Days)</option>
                <option value="STABLE">Stable (5-10 Days)</option>
                <option value="FRESH">Fresh (&gt;10 Days)</option>
              </select>
              <button 
                onClick={() => setShowLogModal(true)} 
                className="flex items-center gap-xs px-sm py-2 bg-primary text-on-primary rounded-lg text-label-md font-bold shadow-lg hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span> Log Shipment
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
            <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
              <h4 className="font-headline-md text-headline-md mb-xs">Fruits &amp; Citrus</h4>
              <p className="font-body-md text-body-md text-outline mb-md">94% Optimal Condition</p>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="bg-secondary h-full" style={{width: "94%"}}></div>
              </div>
            </div>
            <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
              <h4 className="font-headline-md text-headline-md mb-xs">Dairy &amp; Poultry</h4>
              <p className="font-body-md text-body-md text-outline mb-md">82% Optimal Condition</p>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="bg-tertiary h-full" style={{width: "82%"}}></div>
              </div>
            </div>
            <div className="bg-white border border-outline-variant rounded-xl p-md shadow-sm">
              <h4 className="font-headline-md text-headline-md mb-xs">Meat &amp; Seafood</h4>
              <p className="font-body-md text-body-md text-outline mb-md">68% Warning State</p>
              <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="bg-error h-full" style={{width: "68%"}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Section */}
        <div className="grid grid-cols-12 gap-md">
          {/* Spoilage Alerts Table */}
          <section className="col-span-12 lg:col-span-8 flex flex-col">
            <div className="bg-white border border-outline-variant rounded-xl flex-1 flex flex-col overflow-hidden">
              <div className="p-md border-b border-outline-variant bg-surface-container-low/50 flex justify-between items-center">
                <h3 className="font-headline-md text-headline-md flex items-center gap-xs">
                  <span className="material-symbols-outlined text-error">warning</span>
                  Freshness & Spoilage Monitor
                </h3>
                <span className="bg-error-container text-on-error-container text-label-sm px-xs py-base rounded-full font-bold">
                  {filteredLogs.length} BATCHES
                </span>
              </div>
              <div className="overflow-auto max-h-[400px]">
                <table className="w-full text-left font-body-md">
                  <thead className="bg-surface-container sticky top-0 font-label-md text-outline">
                    <tr>
                      <th className="px-md py-sm">ITEM BATCH</th>
                      <th className="px-md py-sm">STATUS</th>
                      <th className="px-md py-sm">SHELF LIFE</th>
                      <th className="px-md py-sm">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/30">
                    {loading ? (
                      <tr><td colSpan="4" className="text-center py-4">Loading reports...</td></tr>
                    ) : filteredLogs.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-4 text-outline">No batches match filters.</td></tr>
                    ) : (
                      filteredLogs.map(log => {
                        const daysLeft = getDaysLeft(log.expiryDate);
                        return (
                          <tr key={log.id} className="hover:bg-error-container/5 transition-colors group">
                            <td className="px-md py-md">
                              <div>
                                <p className="font-bold">{log.product?.name}</p>
                                <p className="text-label-sm text-outline">{log.batchCode}</p>
                              </div>
                            </td>
                            <td className="px-md py-md">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                daysLeft <= 5 ? 'bg-error-container text-error' : 'bg-secondary-container text-on-secondary-container'
                              }`}>
                                {daysLeft <= 5 ? 'CRITICAL' : 'STABLE'}
                              </span>
                            </td>
                            <td className="px-md py-md">
                              <span className={`${daysLeft <= 5 ? 'text-error' : 'text-on-surface'} font-bold`}>
                                {daysLeft} Days Left
                              </span>
                            </td>
                            <td className="px-md py-md">
                              <button 
                                onClick={() => reprioritizeBatch(log.id)}
                                className="text-primary font-bold hover:underline"
                              >
                                Reprioritize
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* AI Quality Grading */}
          <section className="col-span-12 lg:col-span-4">
            <div className="bg-white border border-outline-variant rounded-xl p-md h-full">
              <h3 className="font-headline-md text-headline-md mb-md">AI Quality Grading</h3>
              <div className="space-y-md">
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full border-4 border-secondary flex items-center justify-center font-headline-lg text-secondary bg-secondary-container/10">A</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-label-md mb-xs">
                      <span>Premium Grade</span>
                      <span className="font-bold">72%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="bg-secondary h-full" style={{width: "72%"}}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full border-4 border-tertiary flex items-center justify-center font-headline-lg text-tertiary bg-tertiary-container/10">B</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-label-md mb-xs">
                      <span>Standard Grade</span>
                      <span className="font-bold">18%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="bg-tertiary h-full" style={{width: "18%"}}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-md">
                  <div className="w-12 h-12 rounded-full border-4 border-error flex items-center justify-center font-headline-lg text-error bg-error-container/10">C</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-label-md mb-xs">
                      <span>Sub-par / Waste</span>
                      <span className="font-bold">10%</span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div className="bg-error h-full" style={{width: "10%"}}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Log Shipment Modal */}
      {showLogModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-xl max-w-md w-full border border-outline-variant overflow-hidden shadow-2xl">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h2 className="font-headline-md text-headline-md">Log Manual Shipment</h2>
              <button onClick={() => setShowLogModal(false)} className="material-symbols-outlined text-outline">close</button>
            </div>
            <form onSubmit={handleLogShipment} className="p-md space-y-md">
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Product SKU</label>
                <select value={sku} onChange={(e) => setSku(e.target.value)} className="w-full p-2 border border-outline-variant rounded bg-white">
                  <option value="SKU-8842-DAIRY">Organic Whole Milk (SKU-8842)</option>
                  <option value="SKU-1092-PROD">Fresh Strawberries (SKU-1092)</option>
                </select>
              </div>
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Batch / Lot Code</label>
                <input required type="text" placeholder="e.g. L993-C" value={batchCode} onChange={(e) => setBatchCode(e.target.value)} className="w-full p-2 border border-outline-variant rounded bg-white text-black" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">Expiry Date</label>
                <input required type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} className="w-full p-2 border border-outline-variant rounded bg-white text-black" />
              </div>
              <div>
                <label className="font-label-md text-label-md text-outline uppercase block mb-1">AI Confidence Score (%)</label>
                <input required type="number" min="80" max="100" value={confidenceScore} onChange={(e) => setConfidenceScore(e.target.value)} className="w-full p-2 border border-outline-variant rounded bg-white text-black" />
              </div>
              <div className="pt-md flex justify-end space-x-2">
                <button type="button" onClick={() => setShowLogModal(false)} className="px-md py-2 border border-outline-variant rounded font-label-md">Cancel</button>
                <button type="submit" className="px-md py-2 bg-primary text-white rounded font-label-md shadow-md">Submit Shipment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Freshness;
