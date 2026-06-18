'use client';

import React, { useState, useEffect } from 'react';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Education from '../components/Education';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import gsap from 'gsap';

export default function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (loading) {
      document.documentElement.classList.add('locked-scroll');
      document.body.classList.add('locked-scroll');
    } else {
      document.documentElement.classList.remove('locked-scroll');
      document.body.classList.remove('locked-scroll');
    }
    return () => {
      document.documentElement.classList.remove('locked-scroll');
      document.body.classList.remove('locked-scroll');
    };
  }, [loading]);

  const handlePreloaderComplete = () => {
    setLoading(false);
    gsap.fromTo('.main-content-layout',
      { opacity: 0 },
      { opacity: 1, duration: 1.0, ease: 'power2.out', clearProps: 'all' }
    );
  };

  return (
    <>
      <Preloader onComplete={handlePreloaderComplete} />

      <div 
        className="main-content-layout w-full flex flex-col min-h-screen relative"
        style={{ opacity: loading ? 0 : 1 }}
      >
        <Navbar />
        <main className="w-full flex-grow bg-[#FAF6EE]">
          <Hero />
          <Projects />
          <Education />
          <Experience />
          <Contact />
        </main>

        <footer className="w-full border-t border-[#d3c2c5] bg-[#fef9f3] py-8 text-center text-sm text-[#1d1b18] font-sans relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} KUNAL • DEV. All rights reserved.</p>
            <p className="flex items-center gap-1.5 text-xs text-[#1d1b18]/60">
              Built with Next.js & GSAP
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}