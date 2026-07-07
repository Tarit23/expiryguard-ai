import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNav from './TopNav';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background text-on-surface">
      <Sidebar />
      <main className="ml-[260px] flex-grow flex flex-col min-h-screen">
        <TopNav />
        <div className="flex-grow flex flex-col">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
