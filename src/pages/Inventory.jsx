import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Inventory = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedSku, setExpandedSku] = useState(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get('/api/inwarding');
        setLogs(res.data);
      } catch (err) {
        console.error("Failed to fetch inventory:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  const getDaysLeft = (expiryDate) => {
    const diff = new Date(expiryDate) - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Group logs by SKU
  const groupedInventory = logs.reduce((acc, log) => {
    const sku = log.product?.sku;
    if (!acc[sku]) {
      acc[sku] = {
        productName: log.product?.name || 'Unknown Product',
        sku: sku,
        supplier: log.product?.supplier,
        batches: []
      };
    }
    acc[sku].batches.push(log);
    return acc;
  }, {});

  const toggleExpand = (sku) => {
    if (expandedSku === sku) {
      setExpandedSku(null);
    } else {
      setExpandedSku(sku);
    }
  };

  return (
    <div className="p-md max-w-container-max mx-auto w-full">
      <div className="flex justify-between items-end mb-xl">
        <div>
          <h1 className="font-display-sm text-display-sm text-on-surface tracking-tight mb-2">Lot-Level Inventory Control</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Track inventory by unique production lots. Expired batches do not affect the status of fresh batches of the same product.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low border-b border-outline-variant">
            <tr>
              <th className="w-8 px-6 py-4"></th>
              <th className="px-6 py-4 font-label-md text-outline uppercase">Product Name</th>
              <th className="px-6 py-4 font-label-md text-outline uppercase">SKU</th>
              <th className="px-6 py-4 font-label-md text-outline uppercase">Total Batches</th>
              <th className="px-6 py-4 font-label-md text-outline uppercase">Supplier</th>
              <th className="px-6 py-4 font-label-md text-outline uppercase">Inventory Health</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-on-surface-variant">Loading inventory...</td>
              </tr>
            ) : Object.keys(groupedInventory).length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-on-surface-variant">No inventory logged yet.</td>
              </tr>
            ) : (
              Object.values(groupedInventory).map((group) => {
                const hasExpiredBatch = group.batches.some(b => getDaysLeft(b.expiryDate) <= 0);
                const hasCriticalBatch = group.batches.some(b => getDaysLeft(b.expiryDate) <= 5 && getDaysLeft(b.expiryDate) > 0);
                const isExpanded = expandedSku === group.sku;

                return (
                  <React.Fragment key={group.sku}>
                    <tr onClick={() => toggleExpand(group.sku)} className="hover:bg-surface-container transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-center">
                        <span className="material-symbols-outlined transition-transform duration-200" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none' }}>
                          chevron_right
                        </span>
                      </td>
                      <td className="px-6 py-4 font-body-md font-bold text-on-surface">{group.productName}</td>
                      <td className="px-6 py-4 font-body-md font-mono text-outline">{group.sku}</td>
                      <td className="px-6 py-4 font-body-md">{group.batches.length} active lots</td>
                      <td className="px-6 py-4 font-body-md">{group.supplier}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          hasExpiredBatch ? 'bg-error-container text-error' : 
                          hasCriticalBatch ? 'bg-tertiary-container text-tertiary' : 'bg-secondary-container text-on-secondary-container'
                        }`}>
                          {hasExpiredBatch ? 'BATCH EXPIRED' : hasCriticalBatch ? 'WARNING STATE' : 'OPTIMAL'}
                        </span>
                      </td>
                    </tr>
                    
                    {/* Expanded Lot Table */}
                    {isExpanded && (
                      <tr>
                        <td colSpan="6" className="bg-surface-container-low/40 p-0">
                          <div className="px-12 py-4 border-l-4 border-primary">
                            <h4 className="font-label-md text-label-md text-outline uppercase mb-sm">Lot/Batch Breakdown</h4>
                            <table className="w-full text-left border-collapse text-xs">
                              <thead>
                                <tr className="border-b border-outline-variant/60 text-outline">
                                  <th className="py-2">Lot Number</th>
                                  <th className="py-2">Expiry Date</th>
                                  <th className="py-2">Days Left</th>
                                  <th className="py-2">OCR Confidence</th>
                                  <th className="py-2">Lot Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {group.batches.map(batch => {
                                  const daysLeft = getDaysLeft(batch.expiryDate);
                                  return (
                                    <tr key={batch.id} className="border-b border-outline-variant/30">
                                      <td className="py-2 font-mono">{batch.batchCode}</td>
                                      <td className="py-2">{new Date(batch.expiryDate).toLocaleDateString()}</td>
                                      <td className="py-2">
                                        <span className={`font-bold ${daysLeft <= 0 ? 'text-error' : daysLeft <= 5 ? 'text-tertiary' : 'text-secondary'}`}>
                                          {daysLeft <= 0 ? 'Expired' : `${daysLeft} days`}
                                        </span>
                                      </td>
                                      <td className="py-2">{batch.confidenceScore}%</td>
                                      <td className="py-2">
                                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                                          daysLeft <= 0 ? 'bg-error-container text-error' : 'bg-surface-variant text-on-surface'
                                        }`}>
                                          {daysLeft <= 0 ? 'DISCARD LOT' : 'ACTIVE STOCK'}
                                        </span>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
