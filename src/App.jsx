import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Inwarding from './pages/Inwarding';
import FoodSafety from './pages/FoodSafety';
import Freshness from './pages/Freshness';
import Alerts from './pages/Alerts';
import Compliance from './pages/Compliance';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Inventory from './pages/Inventory';
import Reports from './pages/Reports';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Inwarding />} />
          <Route path="food-safety" element={<FoodSafety />} />
          <Route path="freshness" element={<Freshness />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="compliance" element={<Compliance />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
