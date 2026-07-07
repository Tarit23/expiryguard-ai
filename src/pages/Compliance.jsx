import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Compliance = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL'); // ALL, SECURITY, INVENTORY
  
  // Modals
  const [selectedLog, setSelectedLog] = useState(null);
  const [showTraceModal, setShowTraceModal] = useState(false);
  const [traceBatch, setTraceBatch] = useState(null);
  const [showAuditWizard, setShowAuditWizard] = useState(false);

  // Wizard checklist state
  const [step, setStep] = useState(1);
  const [sanitationVerified, setSanitationVerified] = useState(false);
  const [tempVerified, setTempVerified] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('/api/inwarding');
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch logs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter(log => {
    if (activeTab === 'SECURITY') return log.status === 'REJECTED';
    if (activeTab === 'INVENTORY') return log.status === 'APPROVED';
    return true;
  });

  const initiateAudit = () => {
    setStep(1);
    setSanitationVerified(false);
    setTempVerified(false);
    setShowAuditWizard(true);
  };

  const submitAudit = () => {
    alert("Internal Audit Submitted Successfully! Registered in security ledger.");
    setShowAuditWizard(false);
  };

  const exportPDF = () => {
    window.print();
  };

  return (
    <>
      <div className="max-w-container-max mx-auto space-y-md p-md w-full">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="font-headline-xl text-headline-xl text-on-background">Compliance &amp; Audit</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Real-time system integrity and regulatory documentation hub.</p>
          </div>
          <div className="flex gap-sm">
            <button onClick={exportPDF} className="flex items-center gap-xs px-md py-xs bg-white border border-outline-variant text-primary font-label-md rounded-lg hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-[18px]">cloud_download</span> Export PDF
            </button>
            <button onClick={initiateAudit} className="flex items-center gap-xs px-md py-xs bg-primary text-on-primary font-label-md rounded-lg shadow-sm hover:opacity-90 transition-all">
              <span className="material-symbols-outlined text-[18px]">add_task</span> Initiate Internal Audit
            </button>
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-12 gap-md">
          {/* Status Cards */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-md">
            <div className="bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-outline uppercase tracking-wider">Food Safety</span>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold">ACTIVE</span>
              </div>
              <div className="mt-md">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-sm">
                  <span className="material-symbols-outlined text-secondary" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                </div>
                <h3 className="font-headline-md text-headline-md">ISO 22000</h3>
                <p className="text-label-sm text-outline">Expires: Oct 2025</p>
              </div>
            </div>
            <div className="bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-outline uppercase tracking-wider">Quality Control</span>
                <span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold">VERIFIED</span>
              </div>
              <div className="mt-md">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-sm">
                  <span className="material-symbols-outlined text-primary" style={{fontVariationSettings: "'FILL' 1"}}>verified</span>
                </div>
                <h3 className="font-headline-md text-headline-md">HACCP</h3>
                <p className="text-label-sm text-outline">Recertified: Jan 2024</p>
              </div>
            </div>
            <div className="bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <span className="font-label-md text-label-md text-outline uppercase tracking-wider">Data Privacy</span>
                <span className="bg-tertiary-fixed text-on-tertiary-fixed px-2 py-0.5 rounded-full text-[10px] font-bold">RENEWAL</span>
              </div>
              <div className="mt-md">
                <div className="w-12 h-12 rounded-lg bg-tertiary/10 flex items-center justify-center mb-sm">
                  <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>policy</span>
                </div>
                <h3 className="font-headline-md text-headline-md">GDPR Hub</h3>
                <p className="text-label-sm text-outline">Due in 14 days</p>
              </div>
            </div>
          </div>

          {/* Compliance health */}
          <div className="col-span-12 lg:col-span-4 bg-on-background rounded-xl p-md relative overflow-hidden text-surface-lowest">
            <div className="relative z-10 flex flex-col h-full justify-between">
              <div>
                <h3 className="font-headline-md text-headline-md">Security Integrity</h3>
                <p className="text-body-md opacity-70">AI-driven fraud detection active</p>
              </div>
              <div className="flex items-end justify-between mt-xl">
                <div>
                  <span className="block text-[48px] font-bold leading-none text-white">99.8%</span>
                  <span className="text-label-md text-secondary-fixed text-secondary">Compliance Health Score</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-xl overflow-hidden flex flex-col">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-primary">list_alt</span>
                <h3 className="font-headline-md text-headline-md">Audit Log</h3>
              </div>
              <div className="flex items-center gap-sm">
                <div className="flex rounded-lg border border-outline-variant overflow-hidden bg-white">
                  <button onClick={() => setActiveTab('ALL')} className={`px-3 py-1 text-label-md transition-colors ${activeTab === 'ALL' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>All Logs</button>
                  <button onClick={() => setActiveTab('SECURITY')} className={`px-3 py-1 text-label-md transition-colors ${activeTab === 'SECURITY' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Security</button>
                  <button onClick={() => setActiveTab('INVENTORY')} className={`px-3 py-1 text-label-md transition-colors ${activeTab === 'INVENTORY' ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>Inventory</button>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left font-body-md">
                <thead className="bg-surface-container-low text-on-surface-variant font-label-md">
                  <tr>
                    <th className="px-md py-sm">Timestamp</th>
                    <th className="px-md py-sm">Event Type</th>
                    <th className="px-md py-sm">Entity ID</th>
                    <th className="px-md py-sm">Status</th>
                    <th className="px-md py-sm text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {loading ? (
                    <tr><td colSpan="5" className="text-center py-md text-outline">Loading audit logs...</td></tr>
                  ) : filteredLogs.length === 0 ? (
                    <tr><td colSpan="5" className="text-center py-md text-outline">No logs match active filters.</td></tr>
                  ) : (
                    filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-md py-md text-label-sm tabular-nums text-outline">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="px-md py-md">
                          <div className="flex items-center gap-xs">
                            <span className={`w-2 h-2 rounded-full ${log.status === 'APPROVED' ? 'bg-secondary' : log.status === 'REJECTED' ? 'bg-error' : 'bg-primary'}`}></span>
                            {log.status === 'APPROVED' ? 'Auto-Scan Verified' : log.status === 'REJECTED' ? 'Manual Rejection' : 'Scan Logged'}
                          </div>
                        </td>
                        <td className="px-md py-md font-mono text-label-sm">{log.product?.sku}</td>
                        <td className="px-md py-md">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'APPROVED' ? 'bg-secondary-container/20 text-on-secondary-container' : log.status === 'REJECTED' ? 'bg-error-container text-on-error-container' : 'bg-surface-variant text-on-surface'}`}>
                            {log.status}
                          </span>
                        </td>
                        <td className="px-md py-md text-right">
                          <button onClick={() => setSelectedLog(log)} className="material-symbols-outlined text-outline hover:text-primary transition-colors">open_in_new</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Traceability Sidebar */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant rounded-xl p-md flex flex-col justify-between">
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-md text-headline-md">Live Traceability</h3>
              <span className="text-label-md text-primary bg-primary/10 px-2 py-1 rounded">Batch Trace</span>
            </div>
            <div className="space-y-md">
              <p className="text-body-md text-on-surface-variant">Trace batch movement across warehouse lifecycles.</p>
              <button 
                onClick={() => {
                  if (logs.length > 0) {
                    setTraceBatch(logs[0]);
                    setShowTraceModal(true);
                  } else {
                    alert("No logs available to trace.");
                  }
                }} 
                className="w-full py-sm border border-outline text-on-surface-variant font-label-md rounded-lg hover:bg-surface-container-high transition-colors"
              >
                View Full History Trace
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-xl max-w-md w-full border border-outline-variant overflow-hidden shadow-2xl">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h2 className="font-headline-md text-headline-md">Log Metadata Details</h2>
              <button onClick={() => setSelectedLog(null)} className="material-symbols-outlined text-outline">close</button>
            </div>
            <div className="p-md space-y-md">
              <pre className="bg-surface-container-low p-sm rounded text-xs overflow-auto font-mono">
                {JSON.stringify(selectedLog, null, 2)}
              </pre>
              <div className="flex justify-end">
                <button onClick={() => setSelectedLog(null)} className="px-md py-2 bg-primary text-white rounded font-label-md shadow-md">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trace History Modal */}
      {showTraceModal && traceBatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-xl max-w-md w-full border border-outline-variant overflow-hidden shadow-2xl">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h2 className="font-headline-md text-headline-md">Trace Lifecycle: {traceBatch.batchCode}</h2>
              <button onClick={() => setShowTraceModal(false)} className="material-symbols-outlined text-outline">close</button>
            </div>
            <div className="p-md relative space-y-md">
              <div className="absolute left-[20px] top-6 bottom-6 w-0.5 bg-outline-variant"></div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-white border-2 border-white shadow">
                  <span className="material-symbols-outlined text-xs">warehouse</span>
                </div>
                <div>
                  <h4 className="font-label-md font-bold">Inwarding &amp; AI Triage</h4>
                  <p className="text-label-sm text-outline">{new Date(traceBatch.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white border-2 border-white shadow">
                  <span className="material-symbols-outlined text-xs">thermostat</span>
                </div>
                <div>
                  <h4 className="font-label-md font-bold">Cold Chain Stabilization</h4>
                  <p className="text-label-sm text-outline">Checked Zone 4 sensors</p>
                </div>
              </div>
              <div className="relative pl-8">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-tertiary flex items-center justify-center text-white border-2 border-white shadow">
                  <span className="material-symbols-outlined text-xs">fact_check</span>
                </div>
                <div>
                  <h4 className="font-label-md font-bold">QA Status Certification</h4>
                  <p className="text-label-sm text-outline">Marked as: {traceBatch.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Internal Audit Wizard Modal */}
      {showAuditWizard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-xl max-w-md w-full border border-outline-variant overflow-hidden shadow-2xl">
            <div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h2 className="font-headline-md text-headline-md">Internal Audit Wizard (Step {step}/2)</h2>
              <button onClick={() => setShowAuditWizard(false)} className="material-symbols-outlined text-outline">close</button>
            </div>
            <div className="p-md space-y-md">
              {step === 1 && (
                <div>
                  <h3 className="font-body-md font-bold mb-md">Verify Facility Sanitation Status</h3>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="sanCheck" checked={sanitationVerified} onChange={(e) => setSanitationVerified(e.target.checked)} className="w-4 h-4 text-primary" />
                    <label htmlFor="sanCheck" className="text-body-md">Confirm Sanitization Swabs are complete.</label>
                  </div>
                  <div className="pt-md flex justify-end">
                    <button disabled={!sanitationVerified} onClick={() => setStep(2)} className="px-md py-2 bg-primary text-white rounded font-label-md shadow-md disabled:opacity-50">Next Step</button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div>
                  <h3 className="font-body-md font-bold mb-md">Verify Temperature Logs</h3>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="tempCheck" checked={tempVerified} onChange={(e) => setTempVerified(e.target.checked)} className="w-4 h-4 text-primary" />
                    <label htmlFor="tempCheck" className="text-body-md">Confirm all sensor nodes are online.</label>
                  </div>
                  <div className="pt-md flex justify-between">
                    <button onClick={() => setStep(1)} className="px-md py-2 border border-outline-variant rounded font-label-md">Back</button>
                    <button disabled={!tempVerified} onClick={submitAudit} className="px-md py-2 bg-primary text-white rounded font-label-md shadow-md disabled:opacity-50">Submit Audit</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Compliance;
