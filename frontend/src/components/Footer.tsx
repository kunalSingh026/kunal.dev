'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUp, Sparkles } from 'lucide-react';
import { Github, Linkedin } from './Icons';

// Custom Instagram SVG to match brand style
const Instagram = ({ size = 20, className, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export default function Footer() {
  const [time, setTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateTime = () => {
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTime(new Date().toLocaleTimeString('en-US', options));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#080707] text-[#FAF6EE] border-t border-[#FAF6EE]/10 pt-20 pb-12 font-sans relative overflow-hidden select-none z-20">
      {/* Subtle Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.01] bg-[radial-gradient(#FAF6EE_1.5px,transparent_1.5px)] [background-size:20px_20px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 relative z-10">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 pb-16 border-b border-white/[0.08]">
          
          {/* Col 1: Brand & Logo */}
          <div className="space-y-6">
            <Link 
              href="/" 
              className="inline-block font-sans font-black text-2xl tracking-tight text-white hover:text-[#f9c7d2] transition-colors uppercase"
            >
              KUNAL<span className="text-[#f9c7d2] mx-0.5">•</span>DEV
            </Link>
            <p className="text-sm text-white/50 font-light leading-relaxed max-w-xs">
              Crafting premium digital ecosystems where elegant UI meets high-performance backends and robust system architecture.
            </p>
            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-widest text-[#caebcc] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#27c93f] animate-pulse" />
              SYSTEMS RUNNING NOMINAL
            </div>
          </div>

          {/* Col 2: Navigation Sitemap */}
          <div className="space-y-6">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">Sitemap Navigation</h4>
            <ul className="space-y-3 text-sm font-medium text-white/70">
              <li>
                <Link href="#projects" className="hover:text-[#f9c7d2] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f9c7d2] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Featured Work
                </Link>
              </li>
              <li>
                <Link href="#arsenal" className="hover:text-[#f4ccab] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f4ccab] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Dev Arsenal
                </Link>
              </li>
              <li>
                <Link href="#education" className="hover:text-[#caebcc] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#caebcc] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Academic History
                </Link>
              </li>
              <li>
                <Link href="#experience" className="hover:text-[#f9c7d2] transition-colors flex items-center gap-1.5 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f9c7d2] opacity-0 group-hover:opacity-100 transition-opacity" />
                  Professional Journey
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Core Focus / Specialties */}
          <div className="space-y-6">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">Core Expertise</h4>
            <ul className="space-y-3 text-sm text-white/60 font-light">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f9c7d2]" />
                Full-Stack Architecture
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f4ccab]" />
                Interactive Creative UI
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#caebcc]" />
                DevOps Pipelines & CI/CD
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                Cloud Systems Scaling
              </li>
            </ul>
          </div>

          {/* Col 4: Connection & Live Clock */}
          <div className="space-y-6">
            <h4 className="text-xs font-mono uppercase tracking-widest text-white/40">Temporal Node</h4>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3">
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-0.5">Local Time Zone</span>
                <span className="text-sm font-semibold text-white flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f9c7d2]" />
                  Jamshedpur (UTC+5:30)
                </span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest block mb-0.5">Live Local Clock</span>
                <span className="text-lg font-mono font-bold text-[#f4ccab] tracking-wider">
                  {mounted ? time || 'Loading...' : '00:00:00 AM'}
                </span>
              </div>
            </div>
            {/* Call to action */}
            <Link 
              href="#contact" 
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#f9c7d2] hover:text-white transition-colors"
            >
              Initiate Collaboration
              <Sparkles size={12} className="animate-pulse" />
            </Link>
          </div>

        </div>

        {/* Footer Sub-Bar (Copyrights & Socials) */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-10">
          {/* Copyrights */}
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left text-xs text-white/40 font-light">
            <p>© {new Date().getFullYear()} KUNAL • DEV. All rights reserved.</p>
            <span className="hidden sm:inline text-white/20">|</span>
            <p className="flex items-center gap-1.5">
              Refactored with precision & custom micro-interactions
            </p>
          </div>

          {/* Social Icons & Back to Top */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/kunalSingh026" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-white/5 hover:bg-[#FAF6EE] text-white hover:text-[#1d1b18] rounded-xl border border-white/10 transition-colors"
                title="GitHub"
              >
                <Github size={18} />
              </a>
              <a 
                href="https://www.linkedin.com/in/s-kunal-kumar-singh-7662ad" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-white/5 hover:bg-[#FAF6EE] text-white hover:text-[#1d1b18] rounded-xl border border-white/10 transition-colors"
                title="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://www.instagram.com/kunal__3207/?__pwa=1" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 bg-white/5 hover:bg-[#FAF6EE] text-white hover:text-[#1d1b18] rounded-xl border border-white/10 transition-colors"
                title="Instagram"
              >
                <Instagram size={18} />
              </a>
            </div>

            {/* Back to Top */}
            <button 
              onClick={scrollToTop}
              className="p-3 bg-[#FFD000] text-[#1d1b18] hover:bg-[#f9c7d2] rounded-xl border border-[#1d1b18] transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(250,246,238,0.15)] cursor-pointer"
              title="Back to Top"
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
