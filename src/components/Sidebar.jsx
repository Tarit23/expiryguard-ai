import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { name: 'Inwarding', path: '/', icon: 'input' },
    { name: 'Food Safety', path: '/food-safety', icon: 'security' },
    { name: 'Freshness', path: '/freshness', icon: 'nutrition' },
    { name: 'Alerts', path: '/alerts', icon: 'notifications_active' },
    { name: 'Compliance', path: '/compliance', icon: 'verified_user' },
    { name: 'Executive Dashboard', path: '/dashboard', icon: 'dashboard' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col z-50 bg-on-background dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline w-[260px]">
      <div className="p-md">
        <h1 className="font-headline-lg text-headline-lg font-bold text-white">ExpiryGuard AI</h1>
        <p className="font-label-md text-label-md text-surface-variant opacity-60">Enterprise OS</p>
      </div>
      
      <nav className="mt-md flex-grow space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-md py-3 transition-all duration-200 ${
                isActive
                  ? 'text-primary font-bold bg-primary-container/10 border-l-2 border-primary'
                  : 'text-surface-variant hover:bg-surface-container-highest/20 hover:text-white'
              }`
            }
          >
            <span className="material-symbols-outlined mr-3">{item.icon}</span>
            <span className="font-body-md text-body-md">{item.name}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="mt-auto border-t border-outline/20 p-md space-y-2">
        <NavLink to="/profile" className={({ isActive }) => `flex items-center px-md py-2 transition-colors ${isActive ? 'text-primary font-bold' : 'text-surface-variant hover:text-white'}`}>
          <span className="material-symbols-outlined mr-3">account_circle</span>
          <span className="font-body-md text-body-md">Profile</span>
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `flex items-center px-md py-2 transition-colors ${isActive ? 'text-primary font-bold' : 'text-surface-variant hover:text-white'}`}>
          <span className="material-symbols-outlined mr-3">settings</span>
          <span className="font-body-md text-body-md">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
