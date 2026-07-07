import React from 'react';
import { NavLink } from 'react-router-dom';

const TopNav = () => {
  return (
    <header className="flex justify-between items-center w-full px-md h-16 bg-surface border-b border-outline-variant sticky top-0 z-40">
      <div className="flex items-center space-x-md">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `font-label-md text-label-md cursor-pointer pb-1 transition-colors ${
              isActive ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          Inwarding Stream
        </NavLink>
        <NavLink
          to="/inventory"
          className={({ isActive }) =>
            `font-label-md text-label-md cursor-pointer pb-1 transition-colors ${
              isActive ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          Inventory
        </NavLink>
        <NavLink
          to="/reports"
          className={({ isActive }) =>
            `font-label-md text-label-md cursor-pointer pb-1 transition-colors ${
              isActive ? 'text-primary border-b-2 border-primary font-bold' : 'text-on-surface-variant hover:text-primary'
            }`
          }
        >
          Reports
        </NavLink>
      </div>
      <div className="flex items-center space-x-sm">
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">sensors</span>
        </button>
        <button className="p-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">account_tree</span>
        </button>
        <div className="h-8 w-8 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant ml-xs">
          <img
            className="w-full h-full object-cover"
            alt="Profile"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDb98VuolZqoe8fB0jZ-yKfBq2VqzuNO3uBbWzmIFUOrlp6wc8LM0j_NPaq3BGDayZ4OMOHbLIqEb3YmNPB1g5YXNxVT2draNM27CJ9tStqoKvWa2cAW0E0vcZmQBugWr4uO7so1udfLFZmWO5664iQmcjA65W1t-zoJQMRSx6BbaEB7VgcY8knrwNxWgEzF0oal1dp9IsBgMOOXJYfNassxdMok_ynmStqlUpowfuHQ_OiLMoZH2QG"
          />
        </div>
      </div>
    </header>
  );
};

export default TopNav;
