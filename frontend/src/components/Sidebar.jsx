import React, { useState, useEffect } from 'react';
import { 
  XIcon, 
  LayoutDashboardIcon, 
  BarChart2Icon, 
  SettingsIcon, 
  LogOutIcon, 
  BriefcaseIcon,
  PaletteIcon
} from 'lucide-react';
import { Link } from 'react-router';
import { THEMES } from './themes.js';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("tracklicant_theme") || "dark";
  });

  // Apply theme to document on change & mount
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("tracklicant_theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
  };

  return (
    <>
      {/* 1. Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 2. Sliding Drawer */}
      <aside
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        className={`fixed top-0 left-0 h-screen w-72 bg-base-200 border-r border-base-content/10 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col justify-between p-6 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Section: Header & Navigation */}
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-4 border-b border-base-content/10">
            <div className="flex items-center gap-2">
              <BriefcaseIcon className="size-6 text-primary" />
              <span className="text-xl font-bold font-mono text-primary">Tracklicant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="btn btn-ghost btn-circle btn-xs text-base-content/60 hover:text-base-content"
            >
              <XIcon className="size-4" />
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex flex-col gap-1.5">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-base-300 transition-colors text-base-content/80 hover:text-primary"
            >
              <LayoutDashboardIcon className="size-4" />
              <span>Applications</span>
            </Link>

            <Link
              to="/analytics"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-base-300 transition-colors text-base-content/80 hover:text-primary"
            >
              <BarChart2Icon className="size-4" />
              <span>Analytics & Stats</span>
            </Link>

            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-base-300 transition-colors text-base-content/80 hover:text-primary"
            >
              <SettingsIcon className="size-4" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Theme Selector Section */}
          <div className="pt-4 border-t border-base-content/10">
            <div className="flex items-center gap-2 px-1 mb-2.5">
              <PaletteIcon className="size-4 text-primary" />
              <span className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                Interface Theme
              </span>
            </div>

            <select
              value={theme}
              onChange={(e) => handleThemeChange(e.target.value)}
              className="select select-bordered select-sm w-full rounded-xl bg-base-100 text-xs font-semibold capitalize focus:border-primary"
            >
              {THEMES.map((t) => (
                <option key={t} value={t} className="capitalize">
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-base-content/10">
          <button
            onClick={() => {
              setIsOpen(false);
              // Plug in your auth logout call here later
            }}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 transition-colors cursor-pointer"
          >
            <LogOutIcon className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;