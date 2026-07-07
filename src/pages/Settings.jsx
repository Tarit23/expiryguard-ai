import React from 'react';

const Settings = () => {
  return (
    <div className="p-md max-w-container-max mx-auto w-full">
      <div className="mb-xl">
        <h1 className="font-display-sm text-display-sm text-on-surface tracking-tight mb-2">System Settings</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Configure system thresholds, scanning rules, and alert zones.</p>
      </div>

      <div className="bg-white rounded-xl border border-outline-variant p-md shadow-sm max-w-2xl space-y-xl">
        <div>
          <h2 className="font-headline-md text-headline-md mb-4">Scanning Rules</h2>
          <div className="space-y-sm">
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded">
              <div>
                <p className="font-body-md font-bold">Auto-Approve OCR Match</p>
                <p className="text-label-sm text-outline">Approve batch instantly if OCR certainty exceeds 95%.</p>
              </div>
              <input type="checkbox" defaultChecked className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center justify-between p-3 bg-surface-container-low rounded">
              <div>
                <p className="font-body-md font-bold">Strict Freshness Threshold</p>
                <p className="text-label-sm text-outline">Flag any item with less than 5 days shelf-life as EXPIRED.</p>
              </div>
              <input type="checkbox" className="w-4 h-4 text-primary" />
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-headline-md text-headline-md mb-4">Thresholds</h2>
          <div className="space-y-md">
            <div>
              <label className="font-label-md text-label-md text-outline uppercase block mb-1">Cold Chain Limit (°C)</label>
              <input type="number" defaultValue="4.0" className="p-2 border border-outline-variant rounded w-32 text-black" />
            </div>
            <div>
              <label className="font-label-md text-label-md text-outline uppercase block mb-1">AI Camera Confidence Warning (%)</label>
              <input type="number" defaultValue="90" className="p-2 border border-outline-variant rounded w-32 text-black" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
