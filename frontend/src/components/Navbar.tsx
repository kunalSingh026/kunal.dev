'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import gsap from 'gsap';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    gsap.fromTo('.nav-item', 
      { opacity: 0, y: -10 },
      { opacity: 1, y: 0, duration: 0.6, delay: 1.8, stagger: 0.05, ease: 'power3.out', clearProps: 'all' }
    );
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-[#FAF6EE]/85 backdrop-blur-md border-b border-[#d3c2c5] py-5 md:py-6 select-none">
      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 flex items-center justify-between">
        
        <Link 
          href="/" 
          className="nav-item font-sans font-black text-2xl tracking-tight text-[#1d1b18] hover:text-[#7a545d] transition-colors uppercase"
        >
          KUNAL<span className="text-[#7a545d] mx-0.5">•</span>DEV
        </Link>

        <div className="hidden md:flex items-center gap-8 font-sans font-medium text-sm text-[#1d1b18]">
          <Link href="#projects" className="nav-item hover:text-[#7a545d] transition-colors">Projects</Link>
          <Link href="#about" className="nav-item hover:text-[#7a545d] transition-colors">About Me</Link>
          <Link href="#education" className="nav-item hover:text-[#7a545d] transition-colors">Education</Link>
          <Link href="#achievements" className="nav-item hover:text-[#7a545d] transition-colors">Achievements</Link>
          <Link href="#experience" className="nav-item hover:text-[#7a545d] transition-colors">Experience</Link>
          <Link href="#contact" className="nav-item hover:text-[#7a545d] transition-colors">Contact Me</Link>
        </div>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-[#1d1b18] hover:text-[#7a545d] p-1 transition-colors cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden fixed inset-x-0 top-[72px] bg-[#FAF6EE] border-b border-[#d3c2c5] flex flex-col py-6 px-8 gap-4 shadow-lg z-40">
          <Link href="#projects" onClick={() => setIsOpen(false)} className="text-[#1d1b18] font-medium text-base hover:text-[#7a545d] transition-colors">Projects</Link>
          <Link href="#about" onClick={() => setIsOpen(false)} className="text-[#1d1b18] font-medium text-base hover:text-[#7a545d] transition-colors">About Me</Link>
          <Link href="#education" onClick={() => setIsOpen(false)} className="text-[#1d1b18] font-medium text-base hover:text-[#7a545d] transition-colors">Education</Link>
          <Link href="#achievements" onClick={() => setIsOpen(false)} className="text-[#1d1b18] font-medium text-base hover:text-[#7a545d] transition-colors">Achievements</Link>
          <Link href="#experience" onClick={() => setIsOpen(false)} className="text-[#1d1b18] font-medium text-base hover:text-[#7a545d] transition-colors">Experience</Link>
          <Link href="#contact" onClick={() => setIsOpen(false)} className="text-[#1d1b18] font-medium text-base hover:text-[#7a545d] transition-colors">Contact Me</Link>
        </div>
      )}
    </nav>
  );
}