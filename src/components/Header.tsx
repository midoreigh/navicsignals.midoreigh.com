import React, { useState, useEffect } from 'react';
import { Satellite, Smartphone, Compass, Download, Menu, X } from 'lucide-react';

interface HeaderProps {
  onTestClick: () => void;
  onCheckPhone: () => void;
  onGetApp: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onTestClick,
  onCheckPhone,
  onGetApp,
}) => {
  const [istTime, setIstTime] = useState<string>('');
  const [utcTime, setUtcTime] = useState<string>('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setIstTime(now.toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: false }));
      setUtcTime(now.toLocaleTimeString('en-US', { timeZone: 'UTC', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#050814]/85 backdrop-blur-md border-b border-sky-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 via-sky-500/20 to-emerald-500/20 border border-sky-400/30 shadow-lg shadow-sky-500/10">
              <Satellite className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                  NavIC<span className="text-orange-400">Signals</span>
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400">
                India's Satellite Navigation & Smartphone Compatibility Guide
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a
              href="#how-it-works"
              className="hover:text-sky-400 transition-colors flex items-center gap-1.5"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              How NavIC Works
            </a>
            <button
              onClick={onCheckPhone}
              className="hover:text-purple-400 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-purple-400" />
              Phone Compatibility
            </button>
          </nav>

          {/* Time & CTA Button */}
          <div className="flex items-center gap-3">
            {/* Clocks */}
            <div className="hidden xl:flex flex-col text-right text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
              <span className="text-slate-300">IST <span className="text-orange-400 font-semibold">{istTime}</span></span>
              <span>UTC <span className="text-sky-400">{utcTime}</span></span>
            </div>

            <button
              onClick={onGetApp}
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-orange-500/20 to-amber-500/20 hover:from-orange-500/30 hover:to-amber-500/30 text-orange-300 border border-orange-500/40 hover:border-orange-400 shadow-md transition-all cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-orange-400" />
              <span>Get Android App</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden w-11 h-11 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl bg-slate-900/80 border border-slate-800 active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-orange-400" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-800 space-y-2 animate-fade-in">
            {/* Mobile clock strip */}
            <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] font-mono mb-2">
              <span className="text-slate-400">IST <strong className="text-orange-400">{istTime}</strong></span>
              <span className="text-slate-400">UTC <strong className="text-sky-400">{utcTime}</strong></span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                IST Sync
              </span>
            </div>

            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 rounded-md flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-sky-400" />
              How NavIC Works
            </a>
            <button
              onClick={() => { onCheckPhone(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800/60 rounded-md flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-purple-400" />
              Phone Compatibility
            </button>
            <button
              onClick={() => { onGetApp(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2.5 text-sm font-semibold text-slate-950 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-95 transition-all mt-2"
            >
              <Download className="w-4 h-4" />
              Get Android App
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
