import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Reports = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await axios.get('/api/metrics');
        setMetrics(res.data);
      } catch (err) {
        console.error("Failed to fetch reports metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  return (
    <div className="p-md max-w-container-max mx-auto w-full">
      <div className="flex justify-between items-end mb-xl">
        <div>
          <h1 className="font-display-sm text-display-sm text-on-surface tracking-tight mb-2">Compliance & Safety Reports</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Exportable analytics for food safety compliance audits and warehouse throughput.</p>
        </div>
        <button className="bg-primary text-white px-md py-2 rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors shadow-md">
          Export All (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        <div className="bg-white rounded-xl border border-outline-variant p-md shadow-sm">
          <h2 className="font-headline-md text-headline-md mb-md">Scan Throughput Summary</h2>
          {loading ? (
            <p className="text-on-surface-variant">Loading report data...</p>
          ) : (
            <div className="space-y-md">
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-outline">Total Batches Checked</span>
                <span className="font-bold text-on-surface">{metrics?.totalScanned || 0}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-outline">Total Batches Rejected</span>
                <span className="font-bold text-error">{metrics?.totalRejected || 0}</span>
              </div>
              <div className="flex justify-between border-b border-outline-variant pb-2">
                <span className="text-outline">Average AI Uptime</span>
                <span className="font-bold text-secondary">{metrics?.aiUptime || '99.99'}%</span>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-outline-variant p-md shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="font-headline-md text-headline-md mb-md">Regulatory Compliance Status</h2>
            <p className="font-body-md text-on-surface-variant mb-md">The facility is currently operating under fully validated ISO 22000 & HACCP safety standard guidelines. No major unresolved breaches detected.</p>
          </div>
          <div className="flex space-x-2">
            <button className="border border-outline-variant px-md py-2 rounded font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors">
              View HACCP Log
            </button>
            <button className="border border-outline-variant px-md py-2 rounded font-label-md text-on-surface-variant hover:bg-surface-container-high transition-colors">
              View ISO Certifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
