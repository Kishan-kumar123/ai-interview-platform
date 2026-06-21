import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Terminal, MessageSquare, Award, FileText, Smartphone, Trophy, LayoutDashboard, User } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  const user = userJson ? JSON.parse(userJson) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  // Navigation matching the exact tab set from the screenshots
  const navItems = [
    { path: '/coding', label: 'Practice', icon: Terminal },
    { path: '/mock-interview', label: 'Mock Interview', icon: MessageSquare },
    { path: '/aptitude', label: 'Aptitude Tests', icon: Smartphone },
    { path: '/resume', label: 'Resume Analyzer', icon: FileText },
    { path: '/contests', label: 'Contest & Hacks', icon: Trophy },
  ];

  return (
    <nav className="bg-[#0f172a] border-b border-slate-800 text-white w-full py-3.5 px-6 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left Side: Logo and Links */}
        <div className="flex items-center gap-6">
          {/* Brand Logo Symbol and Name */}
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white group">
            <div className="w-7 h-7 rounded bg-[#f97316] flex items-center justify-center text-white font-extrabold text-sm shadow-inner">
              &gt;_
            </div>
            <span className="tracking-tight text-white font-sans text-base hover:text-orange-400 transition-colors">
              InterviewAce
            </span>
          </Link>

          {/* Logged-In Navigation Tabs */}
          {token && (
            <div className="hidden lg:flex items-center gap-1.5 ml-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? 'bg-slate-800 text-[#f97316] border border-slate-700'
                        : 'text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Stats & User Details or Auth Buttons */}
        <div className="flex items-center gap-4">
          {token ? (
            <div className="flex items-center gap-4 text-xs">
              
              {/* Daily Streak Fire and Trophy Level Indicator */}
              <div className="hidden sm:flex items-center gap-3 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-slate-300">
                <span className="flex items-center gap-1 text-orange-400 font-extrabold font-mono">
                  <span>🔥 1d</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1 text-yellow-400 font-extrabold font-mono">
                  🏆 100 XP
                </span>
              </div>

              {/* General Dashboard Page Link */}
              <Link
                to="/dashboard"
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                  isActive('/dashboard') ? 'bg-[#f97316]/15 text-[#f97316]' : 'text-slate-300 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>

              {/* User Avatar Initials and Name badge */}
              <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
                <div className="w-5 h-5 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-extrabold text-[10px] font-mono uppercase">
                  {user?.name ? user.name.charAt(0) : 'K'}
                </div>
                <span className="text-slate-300 font-medium hidden md:inline">{user?.name || 'kishan'}</span>
                
                {/* Logout Action trigger */}
                <button
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-400 transition-colors p-0.5 ml-1"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 bg-[#f97316] hover:bg-orange-600 text-white rounded-lg text-xs font-extrabold transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}
