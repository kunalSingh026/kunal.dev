'use client';

import React, { useState, useEffect } from 'react';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import DevArsenal from '../components/DevArsenal';
import Education from '../components/Education';
import Achievements from '../components/Achievements';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
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
          <DevArsenal />
          <Education />
          <Achievements />
          <Experience />
          <Contact />
        </main>

        <Footer />
      </div>
    </>
  );
}