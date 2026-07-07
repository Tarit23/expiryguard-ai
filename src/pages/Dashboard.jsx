import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [dateRange, setDateRange] = useState('30d'); // 7d, 30d, manual
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('/api/metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const exportCSV = () => {
    const headers = 'Metric,Value\n';
    const rows = [
      `Total Scanned,${metrics?.totalScanned || 0}`,
      `Total Rejected,${metrics?.totalRejected || 0}`,
      `Active Alerts,${metrics?.activeAlerts || 0}`,
      `AI Uptime,${metrics?.aiUptime || '99.99'}%`,
      `Date Range Filter,${dateRange === 'manual' ? `${startDate} to ${endDate}` : dateRange}`
    ].join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', `executive_dashboard_summary.csv`);
    a.click();
  };

  return (
    <>
      <div className="p-md max-w-container-max mx-auto space-y-md w-full">
        {/* Header Section with Date Filters */}
        <div className="flex justify-between items-end mb-xl flex-wrap gap-md">
          <div>
            <h1 className="font-display-sm text-display-sm text-on-surface tracking-tight mb-2">Executive Intelligence OS</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Macro analytics and multi-hub quality assurance monitoring.</p>
          </div>
          <div className="flex gap-2 items-center bg-white border border-outline-variant p-2 rounded-lg shadow-sm flex-wrap">
            <button onClick={() => setDateRange('7d')} className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors ${dateRange === '7d' ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container-high'}`}>7 Days</button>
            <button onClick={() => setDateRange('30d')} className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors ${dateRange === '30d' ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container-high'}`}>30 Days</button>
            <button onClick={() => setDateRange('manual')} className={`px-3 py-1.5 rounded font-label-md text-label-md transition-colors ${dateRange === 'manual' ? 'bg-primary text-white' : 'text-on-surface hover:bg-surface-container-high'}`}>Manual Range</button>
            
            {dateRange === 'manual' && (
              <div className="flex space-x-1 items-center pl-2 border-l border-outline-variant">
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="p-1 border border-outline-variant rounded text-xs text-black" />
                <span className="text-xs">to</span>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="p-1 border border-outline-variant rounded text-xs text-black" />
              </div>
            )}
          </div>
        </div>

        {/* Hero Metrics Section */}
        <div className="grid grid-cols-12 gap-md">
          {/* Health Score Card */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant rounded-xl p-6 relative overflow-hidden group shadow-sm">
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-label-md text-label-md uppercase text-outline mb-1">Warehouse Health Score</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-headline-xl text-headline-xl text-primary">94</span>
                    <span className="text-secondary font-bold text-body-md">+2.4%</span>
                  </div>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">verified</span>
                </div>
              </div>
              <p className="text-body-md text-on-surface-variant/80 mb-6">Aggregate performance based on safety, freshness compliance, and scanning speed.</p>
              <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{width: "94%"}}></div>
              </div>
            </div>
          </div>

          {/* Operational Throughput */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-label-md text-label-md uppercase text-outline mb-6">Operational Efficiency</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-label-sm text-outline uppercase">Throughput Rate</p>
                  <p className="font-headline-md text-headline-md">{metrics?.totalScanned || 0} <span className="text-body-md font-normal text-on-surface-variant">units</span></p>
                </div>
                <div className="text-right">
                  <p className="text-secondary text-label-md font-bold">Optimal</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-label-sm text-outline uppercase">Active Alerts</p>
                  <p className="font-headline-md text-headline-md">{metrics?.activeAlerts || 0}</p>
                </div>
                <div className="text-right">
                  <p className="text-error text-label-md font-bold">{metrics?.activeAlerts > 0 ? 'Action Req.' : 'Nominal'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* AI Model Integrity */}
          <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
            <h3 className="font-label-md text-label-md uppercase text-outline mb-4">AI Model Integrity</h3>
            <div className="flex items-end gap-2 mb-4 h-24">
              <div className="flex-1 bg-primary-container/20 rounded-t h-[60%] hover:bg-primary-container/40 transition-colors"></div>
              <div className="flex-1 bg-primary-container/20 rounded-t h-[75%] hover:bg-primary-container/40 transition-colors"></div>
              <div className="flex-1 bg-primary-container/20 rounded-t h-[90%] hover:bg-primary-container/40 transition-colors"></div>
              <div className="flex-1 bg-primary-container/20 rounded-t h-[85%] hover:bg-primary-container/40 transition-colors"></div>
              <div className="flex-1 bg-primary-container/20 rounded-t h-[95%] hover:bg-primary-container/40 transition-colors"></div>
              <div className="flex-1 bg-primary-container/20 rounded-t h-[80%] hover:bg-primary-container/40 transition-colors"></div>
              <div className="flex-1 bg-primary-container/20 rounded-t h-[100%] hover:bg-primary-container/40 transition-colors"></div>
            </div>
            <div className="flex justify-between text-label-sm text-outline border-t border-outline-variant pt-4">
              <span>OCR Accuracy: <b className="text-on-surface">98.2%</b></span>
              <span>Scan Confidence: <b className="text-on-surface">High</b></span>
            </div>
          </div>
        </div>

        {/* Freshness & Network Map Section */}
        <div className="grid grid-cols-12 gap-md">
          {/* Inventory Freshness Profile */}
          <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-headline-md">Inventory Freshness Profile ({dateRange.toUpperCase()})</h3>
            </div>
            <div className="relative h-[200px] w-full flex items-end justify-between gap-4">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 200">
                <path d="M0,180 C100,160 200,100 300,120 C400,140 500,40 600,60 C700,80 800,20 800,20 L800,200 L0,200 Z" fill="#2563eb" fillOpacity="0.1"></path>
                <path d="M0,180 C100,160 200,100 300,120 C400,140 500,40 600,60 C700,80 800,20 800,20" fill="none" stroke="#004ac6" strokeWidth="3"></path>
              </svg>
            </div>
          </div>

          {/* Live Hub Network */}
          <div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant rounded-xl overflow-hidden flex flex-col shadow-sm">
            <div className="p-6 pb-2">
              <h3 className="font-headline-md text-headline-md">Live Hub Network</h3>
              <p className="text-body-md text-on-surface-variant">Real-time status across global mother hubs.</p>
            </div>
            <div className="p-4 bg-surface-container-high/30 flex-grow flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-secondary rounded-full"></span>
                <span className="text-label-md">18 Hubs Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-error rounded-full"></span>
                <span className="text-label-md">1 Hub Alert</span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="font-headline-md text-headline-md">Hub Performance Comparison</h3>
            <button onClick={exportCSV} className="flex items-center gap-2 text-primary font-label-md hover:underline bg-transparent border-0 cursor-pointer">
              <span className="material-symbols-outlined text-sm">download</span> Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr>
                  <th className="px-6 py-4 font-label-md text-outline uppercase">Hub Identifier</th>
                  <th className="px-6 py-4 font-label-md text-outline uppercase">Health Score</th>
                  <th className="px-6 py-4 font-label-md text-outline uppercase">Throughput (U/H)</th>
                  <th className="px-6 py-4 font-label-md text-outline uppercase">Freshness Ratio</th>
                  <th className="px-6 py-4 font-label-md text-outline uppercase">AI Accuracy</th>
                  <th className="px-6 py-4 font-label-md text-outline uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr className="hover:bg-surface-container transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-body-lg font-semibold">Berlin Mother Hub</p>
                      <p className="text-label-sm text-outline">DE-BER-01</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-md font-bold">96/100</td>
                  <td className="px-6 py-4 font-body-md">2,450</td>
                  <td className="px-6 py-4 font-body-md text-secondary">98.2%</td>
                  <td className="px-6 py-4 font-body-md">99.1%</td>
                  <td className="px-6 py-4"><span className="status-pill bg-secondary-container text-on-secondary-fixed">Optimal</span></td>
                </tr>
                <tr className="hover:bg-surface-container transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-body-lg font-semibold">London Dark Store</p>
                      <p className="text-label-sm text-outline">UK-LON-04</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-body-md font-bold">82/100</td>
                  <td className="px-6 py-4 font-body-md">1,120</td>
                  <td className="px-6 py-4 font-body-md text-tertiary">91.5%</td>
                  <td className="px-6 py-4 font-body-md">97.4%</td>
                  <td className="px-6 py-4"><span className="status-pill bg-tertiary-container text-on-tertiary-container">Warning</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
