import React, { useState, useMemo } from 'react';
import { Search, Smartphone, CheckCircle2, XCircle, AlertCircle, Cpu, Filter, Sparkles, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { PHONE_DATABASE, PhoneModel } from '../data/phoneDatabase';

export const PhoneCompatibilityChecker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [filterSupport, setFilterSupport] = useState<string>('All');
  const [displayLimit, setDisplayLimit] = useState<number>(8);

  const brands = useMemo(() => {
    const list = Array.from(new Set(PHONE_DATABASE.map(p => p.brand)));
    return ['All', ...list.sort()];
  }, []);

  const filteredPhones = useMemo(() => {
    return PHONE_DATABASE.filter(phone => {
      const matchesSearch = 
        phone.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.chipset.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.brand.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBrand = selectedBrand === 'All' || phone.brand === selectedBrand;

      const matchesSupport = filterSupport === 'All' 
        ? true 
        : filterSupport === 'Supported' 
        ? phone.navicSupport !== 'No Support'
        : phone.navicSupport === 'No Support';

      return matchesSearch && matchesBrand && matchesSupport;
    });
  }, [searchTerm, selectedBrand, filterSupport]);

  const visiblePhones = useMemo(() => {
    if (searchTerm.trim() !== '' || selectedBrand !== 'All') {
      return filteredPhones;
    }
    return filteredPhones.slice(0, displayLimit);
  }, [filteredPhones, displayLimit, searchTerm, selectedBrand]);

  return (
    <section id="phone-compatibility" className="py-14 sm:py-20 relative border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30 mb-2 sm:mb-3">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Hardware &amp; Modem Compatibility Index</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Does Your Smartphone Support NavIC?
          </h2>
          <p className="mt-2.5 sm:mt-3 text-slate-300 text-xs sm:text-base leading-relaxed px-1">
            To decode NavIC signals, your phone must have an RF front-end tuned to <strong className="text-orange-400">L5 (1176.45 MHz)</strong> or <strong className="text-orange-400">S-band (2492.028 MHz)</strong>, plus a compatible baseband DSP.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-6 sm:mt-8 max-w-4xl mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search phone or chipset (iPhone 15/16 Pro, S24, OnePlus, Snapdragon)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-900/90 rounded-xl border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1 w-full min-w-0">
            {/* Brand Filter - Clean smooth scroll with breathing room and no scrollbar touching buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 px-0.5 w-full min-w-0 touch-pan-x">
              <span className="text-[11px] text-slate-400 mr-1 font-mono shrink-0">Brand:</span>
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    selectedBrand === brand
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>

            {/* Support Filter */}
            <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto py-2">
              <span className="text-[11px] text-slate-400 mr-1 font-mono">Status:</span>
              <button
                onClick={() => setFilterSupport('All')}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium cursor-pointer ${
                  filterSupport === 'All' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterSupport('Supported')}
                className={`px-2 py-0.5 rounded-lg text-xs font-medium cursor-pointer ${
                  filterSupport === 'Supported' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
                }`}
              >
                NavIC Supported
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="max-w-4xl mx-auto mt-3 px-1 flex justify-between items-center text-[11px] text-slate-400 font-mono">
          <span>Showing {visiblePhones.length} of {filteredPhones.length} matching models</span>
          <span className="text-emerald-400">Tested Hardware</span>
        </div>

        {/* Phone Grid */}
        <div className="mt-3 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {visiblePhones.map(phone => {
            const isSupported = phone.navicSupport !== 'No Support';

            return (
              <div
                key={phone.id}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isSupported
                    ? 'bg-slate-900/60 border-slate-800 hover:border-orange-500/40 hover:bg-slate-900'
                    : 'bg-slate-950/40 border-slate-800/60 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {phone.brand} • {phone.releaseYear}
                    </span>
                    <h4 className="text-sm sm:text-base font-bold text-white mt-1">
                      {phone.model}
                    </h4>
                  </div>

                  {isSupported ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shrink-0">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>NavIC Ready</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-rose-500/10 text-rose-300 border border-rose-500/20 shrink-0">
                      <XCircle className="w-3 h-3 text-rose-400" />
                      <span>No NavIC</span>
                    </span>
                  )}
                </div>

                <div className="mt-2.5 flex items-center gap-1.5 text-xs font-mono text-slate-300">
                  <Cpu className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="truncate">{phone.chipset}</span>
                </div>

                <div className="mt-1.5 text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                  {phone.notes}
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex flex-wrap gap-1 text-[9px] font-mono">
                  {phone.supportedBands.map((band, idx) => (
                    <span
                      key={idx}
                      className={`px-1.5 py-0.2 rounded ${
                        band.includes('NavIC')
                          ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {band}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More / Show All Models on Mobile */}
        {searchTerm.trim() === '' && selectedBrand === 'All' && filteredPhones.length > 8 && (
          <div className="mt-6 text-center">
            {displayLimit < filteredPhones.length ? (
              <button
                onClick={() => setDisplayLimit(filteredPhones.length)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-sky-400 border border-sky-500/30 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <span>View All {filteredPhones.length} Smartphone Models</span>
                <ChevronDown className="w-4 h-4 text-sky-400" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setDisplayLimit(8);
                  document.getElementById('phone-compatibility')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800 transition-all cursor-pointer active:scale-95"
              >
                <span>Show Top 8 Only</span>
                <ChevronUp className="w-4 h-4 text-slate-400" />
              </button>
            )}
          </div>
        )}

        {filteredPhones.length === 0 && (
          <div className="text-center py-10 text-slate-400">
            <AlertCircle className="w-7 h-7 text-slate-500 mx-auto mb-2" />
            <p className="text-xs sm:text-sm">No phones match your search filter.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedBrand('All'); setFilterSupport('All'); }}
              className="mt-2 text-xs text-sky-400 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
