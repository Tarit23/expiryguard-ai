import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Alerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  useEffect(() => {
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
    fetchAlerts();
  }, []);

  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-error text-white';
      case 'HIGH':
        return 'bg-error-container text-on-error-container';
      case 'MEDIUM':
        return 'bg-secondary-container text-on-secondary-container';
      default:
        return 'bg-surface-variant text-on-surface';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'TEMPERATURE': return 'ac_unit';
      case 'HYGIENE': return 'clean_hands';
      case 'ANOMALY': return 'warning';
      default: return 'notifications';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    const matchSeverity = severityFilter === 'ALL' || alert.severity === severityFilter;
    const matchType = typeFilter === 'ALL' || alert.type === typeFilter;
    return matchSeverity && matchType;
  });

  return (
    <div className="p-md max-w-container-max mx-auto w-full">
      <div className="flex justify-between items-end mb-xl">
        <div>
          <h1 className="font-display-sm text-display-sm text-on-surface tracking-tight mb-2">Active Alerts & Escalations</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Real-time monitoring of safety, temperature, and anomaly flags.</p>
        </div>
        <div className="flex space-x-2">
          <select 
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)} 
            className="px-sm py-2 border border-outline-variant rounded-lg text-label-md bg-white hover:bg-surface-container-high transition-all"
          >
            <option value="ALL">All Severities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
          </select>
          <select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)} 
            className="px-sm py-2 border border-outline-variant rounded-lg text-label-md bg-white hover:bg-surface-container-high transition-all"
          >
            <option value="ALL">All Types</option>
            <option value="TEMPERATURE">Temperature</option>
            <option value="HYGIENE">Hygiene</option>
            <option value="ANOMALY">Anomaly</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
        {loading ? (
          <div className="col-span-2 text-center p-xl text-on-surface-variant">Loading alerts...</div>
        ) : filteredAlerts.length === 0 ? (
          <div className="col-span-2 text-center p-xl text-on-surface-variant bg-white rounded-xl border border-outline-variant">No active alerts match filters.</div>
        ) : (
          filteredAlerts.map(alert => (
            <div key={alert.id} className="bg-white rounded-xl border border-outline-variant p-md shadow-sm flex items-start space-x-md">
              <div className={`p-3 rounded-lg ${getSeverityStyles(alert.severity)}`}>
                <span className="material-symbols-outlined">{getIcon(alert.type)}</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface capitalize">{alert.type} Alert</h3>
                  <span className="font-label-sm text-label-sm text-outline uppercase">{new Date(alert.createdAt).toLocaleTimeString()}</span>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant mb-3">{alert.message}</p>
                <div className="flex space-x-2">
                  <span className="px-xs py-1 rounded bg-surface-container-highest font-label-sm text-label-sm uppercase">{alert.severity}</span>
                  <span className="px-xs py-1 rounded bg-surface-container-highest font-label-sm text-label-sm uppercase">{alert.status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
