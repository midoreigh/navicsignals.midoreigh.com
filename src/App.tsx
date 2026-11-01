import React, { useRef } from 'react';
import { Header } from './components/Header';
import { LiveDiagnosticHero } from './components/LiveDiagnosticHero';
import { HowPhonesCombineGnss } from './components/HowPhonesCombineGnss';
import { PhoneCompatibilityChecker } from './components/PhoneCompatibilityChecker';
import { MobileAppShowcase } from './components/MobileAppShowcase';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const compatibilityRef = useRef<HTMLDivElement>(null);
  const mobileAppRef = useRef<HTMLDivElement>(null);

  const scrollToPhoneCheck = () => {
    document.getElementById('phone-compatibility')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToApp = () => {
    document.getElementById('mobile-app')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#02040b] text-slate-100 selection:bg-orange-500/30 selection:text-orange-200 overflow-x-hidden w-full max-w-full">
      {/* Top fixed navigation */}
      <Header
        onTestClick={scrollToTop}
        onCheckPhone={scrollToPhoneCheck}
        onGetApp={scrollToApp}
      />

      <main className="flex-1 w-full max-w-full pt-16 sm:pt-20 overflow-x-hidden">
        {/* 1. Hero with Live Browser Diagnostic & Sandbox Explainer */}
        <LiveDiagnosticHero
          onCheckPhone={scrollToPhoneCheck}
          onGetApp={scrollToApp}
        />

        {/* 2. How NavIC Works: GNSS Fundamentals, NavIC Regional Architecture & Urban Canyon Sim */}
        <HowPhonesCombineGnss />

        {/* 3. Smartphone Hardware Compatibility Database & Search */}
        <PhoneCompatibilityChecker />

        {/* 4. Companion Mobile App Showcase & Download APK */}
        <MobileAppShowcase />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
