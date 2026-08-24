import React, { useState, useEffect } from 'react';
import { 
  XIcon, 
  LayoutDashboardIcon, 
  BarChart2Icon, 
  SettingsIcon, 
  LogOutIcon, 
  BriefcaseIcon,
  Compass,
  Beer,
  PaletteIcon
} from 'lucide-react';
import { Link, useLocation } from 'react-router';
import { THEMES } from './themes.js';
import { useAuth } from '../context/AuthContext.jsx';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { authUser, logout } = useAuth();

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

  const handleSignOut = async () => {
    setIsOpen(false);
    await logout();
  };

  const navLinks = [
    { name: "Applications", path: "/", icon: LayoutDashboardIcon },
    { name: "Internship Listings", path: "/explore", icon: Compass },
    { name: "Analytics & Stats", path: "/analytics", icon: BarChart2Icon },
    { name: "Breweries", path: "/breweries", icon: Beer },
    { name: "Settings", path: "/settings", icon: SettingsIcon },
  ];

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

          {/* Dynamic Nav Links */}
          <nav className="flex flex-col gap-1.5">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-base-300 text-primary font-semibold"
                      : "text-base-content/80 hover:bg-base-300 hover:text-primary"
                  }`}
                >
                  <Icon
                    className={`size-4.5 transition-colors ${
                      isActive ? "text-primary" : "text-base-content/60"
                    }`}
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
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

        {/* Footer Actions: User Profile & Sign Out */}
        <div className="pt-4 border-t border-base-content/10 space-y-2">
          {authUser && (
            <div className="flex items-center gap-3 px-2 py-1.5 mb-1">
              {authUser.avatar ? (
                <img
                  src={authUser.avatar}
                  alt={authUser.name}
                  className="size-8 rounded-full ring-1 ring-primary/40 object-cover"
                />
              ) : (
                <div className="size-8 rounded-full bg-primary/20 text-primary font-bold text-xs flex items-center justify-center">
                  {authUser.name?.charAt(0) || "U"}
                </div>
              )}
              <div className="truncate text-left">
                <p className="text-xs font-semibold truncate leading-tight text-base-content">
                  {authUser.name}
                </p>
                <p className="text-[11px] text-base-content/50 truncate">
                  {authUser.email}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={handleSignOut}
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