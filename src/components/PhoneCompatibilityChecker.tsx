import React, { useState, useMemo } from 'react';
import { Search, Smartphone, CheckCircle2, XCircle, AlertCircle, Cpu, ExternalLink, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { PHONE_DATABASE, PhoneModel } from '../data/phoneDatabase';

export const PhoneCompatibilityChecker: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('q') || params.get('search') || '';
    }
    return '';
  });
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [displayLimit, setDisplayLimit] = useState<number>(12);

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

      return matchesSearch && matchesBrand;
    });
  }, [searchTerm, selectedBrand]);

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
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2 sm:mb-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/30">
              <Smartphone className="w-3.5 h-3.5" />
              <span>Hardware &amp; Modem Compatibility Index</span>
            </div>
            <a
              href="https://www.gsmarena.com/results.php3?sFreeText=navic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-400 border border-sky-500/30 hover:bg-sky-500/20 hover:text-sky-300 transition-all cursor-pointer"
            >
              <span>GSMArena: 484+ Phones with NavIC</span>
              <ExternalLink className="w-3 h-3 shrink-0" />
            </a>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Does Your Smartphone Support NavIC?
          </h2>
          <p className="mt-2.5 sm:mt-3 text-slate-300 text-xs sm:text-base leading-relaxed px-1">
            GSMArena tracks over <strong className="text-sky-400">484+ smartphone models</strong> with native NavIC hardware support. Browse our verified index across flagships and high-volume mid-rangers (2020 through 2026 models) or search by phone or chipset.
          </p>
        </div>

        {/* Regulatory & Silicon Context Pill */}
        <div className="mt-6 max-w-4xl mx-auto p-3 sm:p-3.5 rounded-xl bg-slate-900/60 border border-slate-800/90 text-[11px] sm:text-xs text-slate-300 flex items-start gap-2.5 leading-relaxed">
          <Info className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-white">Flagship &amp; Mid-Range Coverage:</strong> India's MeitY regulatory timeline mandated native NavIC across all 5G devices by 2025 and all consumer smartphones by 2026. Hardware support now spans budget devices like the <strong>iPhone SE 4</strong>, <strong>Galaxy A56/A36</strong>, <strong>Redmi Note series</strong>, and <strong>OnePlus Nord</strong> alongside 2025–2026 flagships.
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-4 max-w-4xl mx-auto space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search phone or chipset (S26 Ultra, Galaxy A56, iPhone SE 4, iPhone 18/17/16, Redmi Note, Nord)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2.5 sm:py-3 bg-slate-900/90 rounded-xl border border-slate-700 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
            />
          </div>

          {/* Brand Filter */}
          <div className="flex flex-wrap items-center gap-1.5 w-full pt-1">
            <span className="text-[11px] text-slate-400 mr-1 font-mono shrink-0">Brand:</span>
            {brands.map(brand => (
              <button
                key={brand}
                onClick={() => setSelectedBrand(brand)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                  selectedBrand === brand
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>

          {/* Sub-bar: Results Counter */}
          <div className="flex items-center justify-between gap-2.5 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
            <span>Showing {visiblePhones.length} of {filteredPhones.length} models</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Hardware Verified
            </span>
          </div>
        </div>

        {/* Phone Grid */}
        <div className="mt-4 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
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

        {/* Show More / Show All Models */}
        {searchTerm.trim() === '' && selectedBrand === 'All' && filteredPhones.length > displayLimit && (
          <div className="mt-6 text-center flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setDisplayLimit(filteredPhones.length)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-sky-500/20 to-indigo-500/20 hover:from-sky-500/30 hover:to-indigo-500/30 text-sky-300 border border-sky-500/40 transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <span>View All {filteredPhones.length} Verified Handsets</span>
              <ChevronDown className="w-4 h-4 text-sky-400" />
            </button>
            <a
              href="https://www.gsmarena.com/results.php3?sFreeText=navic"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              <span>See Full 484+ List on GSMArena</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          </div>
        )}

        {searchTerm.trim() === '' && selectedBrand === 'All' && displayLimit >= filteredPhones.length && (
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setDisplayLimit(12);
                document.getElementById('phone-compatibility')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium bg-slate-900/60 hover:bg-slate-800 text-slate-400 border border-slate-800 transition-all cursor-pointer active:scale-95"
            >
              <span>Show Top 12 (2026 Showcase)</span>
              <ChevronUp className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* Empty Search / Filter State with MeitY Regulatory Guidance */}
        {filteredPhones.length === 0 && (
          <div className="mt-8 max-w-2xl mx-auto p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-slate-900/95 via-slate-900/85 to-slate-950/95 border border-slate-700/80 shadow-2xl relative overflow-hidden text-center">
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mb-3 shadow-inner">
                <Smartphone className="w-6 h-6" />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Government of India • MeitY Regulatory Standard</span>
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {searchTerm.trim() ? `No exact listing for "${searchTerm}"` : 'No models match your selection'}
              </h3>

              <div className="my-4 p-4 rounded-xl bg-slate-950/75 border border-slate-800 text-left space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                    <strong className="text-white">Bought your smartphone in India after 2025?</strong> It is equipped with native NavIC support.
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
                    Under statutory directives issued by the <strong className="text-white">Ministry of Electronics and Information Technology (MeitY)</strong>, all 5G smartphones sold in India starting 2025—and all mobile phones nationwide by 2025–2026—are legally mandated to integrate hardware support for India&apos;s <strong className="text-orange-400">NavIC (IRNSS)</strong> satellite constellation.
                  </p>
                </div>
                <div className="flex items-start gap-2.5 text-[11px] sm:text-xs text-slate-400">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Even if your specific device is not yet listed in our curated index, any handset purchased in India post-2025 has native NavIC RF demodulation built into its modem silicon by law.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                <button
                  onClick={() => { setSearchTerm(''); setSelectedBrand('All'); }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 transition-all cursor-pointer active:scale-95"
                >
                  Reset Search &amp; Show All
                </button>
                <a
                  href="https://www.gsmarena.com/results.php3?sFreeText=navic"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all cursor-pointer"
                >
                  <span>Search GSMArena (484+ Models)</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
