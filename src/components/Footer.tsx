import React from 'react';
import { Satellite, Shield, ExternalLink, Heart, Radio, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#02040b] text-slate-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
                <Satellite className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base text-white tracking-tight">
                NavIC<span className="text-orange-400">Signals</span>
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              An independent educational and diagnostic resource explaining smartphone multi-constellation GNSS sensor fusion and India's NavIC (IRNSS) space segment.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
              <span>Open-Source Multi-GNSS Guide & Diagnostics</span>
            </div>
          </div>

          {/* NavIC Specifications */}
          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              NavIC Space Segment
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li><span className="text-slate-300">Constellation:</span> 10 Satellites in Orbit (IRNSS &amp; NVS Fleet)</li>
              <li><span className="text-slate-300">Orbits:</span> 3 GEO (35,786 km) + 7 GSO (29° Inc.)</li>
              <li><span className="text-slate-300">Civilian Frequencies:</span> L5 (1176.45 MHz), S-band, L1</li>
              <li><span className="text-slate-300">Atomic Clocks:</span> Indigenous Rubidium &amp; Space-grade PHM</li>
            </ul>
          </div>

          {/* Technical Specs & Standards */}
          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Standards & APIs
            </div>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a href="https://www.w3.org/TR/geolocation/" target="_blank" rel="noreferrer" className="hover:text-sky-300 transition-colors flex items-center gap-1">
                  <span>W3C Geolocation API Sandbox</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://developer.android.com/reference/android/location/GnssStatus" target="_blank" rel="noreferrer" className="hover:text-sky-300 transition-colors flex items-center gap-1">
                  <span>Android GnssStatus (IRNSS = 7)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.isro.gov.in/NavIC.html" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">
                  <span>ISRO NavIC Official Portal</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal / Note */}
          <div className="space-y-2">
            <div className="font-bold text-white uppercase tracking-wider text-[11px] font-mono">
              Disclaimer &amp; Attribution
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              NavIC Signals is an independent open-source educational project and is not affiliated with, endorsed by, or connected to the Indian Space Research Organisation (ISRO) or the Government of India. NavIC (Navigation with Indian Constellation) and IRNSS are registered trademarks of ISRO.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} NavIC Signals. Open educational resource for modern GNSS navigation.
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>All 10 NavIC satellites in orbit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
