'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Terminal } from 'lucide-react';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [gridSize, setGridSize] = useState({ cols: 0, rows: 0 });
  const [mounted, setMounted] = useState(false);

  // Typing Effect State
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const words = ['BACKENDS', 'FRONTENDS', 'SYSTEMS', 'APPLICATION', 'DEVOPS'];
  const typingSpeed = 120;
  const deletingSpeed = 60;
  const pauseDuration = 1800;

  // client-side mounting & window resize listener
  useEffect(() => {
    setMounted(true);
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const cellSize = 36; // size of each pixel grid square
      setGridSize({
        cols: Math.ceil(width / cellSize),
        rows: Math.ceil(height / cellSize)
      });
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Typing Loop
  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentWord = words[currentWordIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && currentText === currentWord) {
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  // Handle Mouse Spotlight Move on Glassy Card
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Generate background grid cells
  const renderGridCells = () => {
    if (!mounted) return null;
    const cells = [];
    const totalCells = gridSize.cols * gridSize.rows;

    for (let r = 0; r < gridSize.rows; r++) {
      for (let c = 0; c < gridSize.cols; c++) {
        const relX = c / gridSize.cols;
        const relY = r / gridSize.rows;
        
        // Pseudo-random noise for organic pixel edges matching reference image
        const noise = (Math.sin(c * 0.45) + Math.cos(r * 0.45)) * 0.15;
        const isPermanentBlack = (relX + relY + noise) > 1.1;

        cells.push(
          <div 
            key={`${r}-${c}`}
            className={`pixel-cell ${isPermanentBlack ? 'pixel-cell-black' : ''} border-[0.5px] border-[#d3c2c5]/5`}
          />
        );
      }
    }
    return cells;
  };

  return (
    <section 
      ref={containerRef} 
      className="relative min-h-screen w-full bg-[#1d1b18] overflow-hidden flex items-center justify-center isolate"
      id="about"
    >
      {/* Background Pixel Grid Layer - Omitted z-index class to share stacking context with content */}
      <div 
        className="absolute inset-0 w-full h-full grid pointer-events-auto select-none"
        style={{
          gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
          gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
        }}
      >
        {renderGridCells()}
      </div>

      {/* Grid Pattern overlay for texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#000_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none" />

      {/* Content Container Layer - Omitted z-index to allow correct blend mode difference drawing */}
      <div className="relative w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 py-28 pointer-events-none flex flex-col lg:flex-row items-center justify-between gap-16">
        
        {/* Left Column: Text & CTAs */}
        <div className="flex-1 text-left max-w-2xl">
          {/* Tagline */}
          <div className="blend-diff text-white font-sans font-bold text-xs uppercase tracking-widest mb-6 px-1">
            DEPLOYMENT-READY DEVELOPER
          </div>

          {/* Title with Typing Effect */}
          <h1 className="blend-diff text-white font-sans font-black uppercase text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.1] mb-8">
            I CODE A ROBUST <br className="hidden sm:inline" />
            <span className="text-[#f9c7d2] inline-block min-h-[1.2em]">
              {currentText}
              <span className="animate-pulse ml-1 text-white">|</span>
            </span>
          </h1>

          {/* Description */}
          <p className="blend-diff text-white font-sans text-base md:text-lg font-light leading-relaxed mb-10 max-w-xl">
            Hi, I'm Kunal. I bridge the gap between development and deployment. As a Full-Stack & DevOps Engineer, I focus on crafting high-performance backend systems with Django and Express, ensuring they are scalable, secure, and production-ready.
          </p>

          {/* Interactive Action Buttons */}
          <div className="flex flex-wrap gap-5 pointer-events-auto">
            <Link 
              href="#contact" 
              className="px-8 py-5 md:px-10 md:py-5 bg-[#FFD000] text-[#1d1b18] font-sans font-bold text-sm uppercase tracking-wider border border-[#1d1b18] shadow-[4px_4px_0px_0px_#1d1b18] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1d1b18] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#1d1b18] transition-all duration-100 flex items-center gap-2"
            >
              Get in touch
            </Link>
            <a 
              href="/Kunal_Resume.pdf" 
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-5 md:px-10 md:py-5 bg-[#f4ccab] text-[#1d1b18] font-sans font-bold text-sm uppercase tracking-wider border border-[#1d1b18] shadow-[4px_4px_0px_0px_#1d1b18] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_#1d1b18] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_#1d1b18] transition-all duration-100 flex items-center gap-2"
            >
              Resume
              <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Right Column: Glassy Card */}
        <div className="flex-1 w-full max-w-md pointer-events-auto">
          <div 
            ref={cardRef}
            onMouseMove={handleCardMouseMove}
            className="glassy-spotlight-card animate-float rounded-2xl p-10 md:p-12 w-full relative flex flex-col justify-between"
          >
            {/* Terminal Window Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6 select-none">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
                <Terminal size={12} /> kunal.sh
              </div>
            </div>

            {/* Code / Stats details */}
            <div className="font-mono text-xs md:text-sm text-white/85 space-y-4 leading-relaxed">
              <div>
                <span className="text-[#f9c7d2] font-semibold">kunal</span>
                <span className="text-white/60"> = </span>
                <span className="text-white font-medium">{'{'}</span>
              </div>
              
              <div className="pl-4">
                <span className="text-[#f4ccab]">focus:</span>
                <span className="text-white/60"> "</span>
                <span className="text-[#caebcc]">Full-Stack & DevOps</span>
                <span className="text-white/60">",</span>
              </div>

              <div className="pl-4">
                <span className="text-[#f4ccab]">backends:</span>
                <span className="text-white/60"> [</span>
                <span className="text-[#caebcc]">"Django"</span>
                <span className="text-white/60">, </span>
                <span className="text-[#caebcc]">"Express"</span>
                <span className="text-white/60">, </span>
                <span className="text-[#caebcc]">"Node"</span>
                <span className="text-white/60">],</span>
              </div>

              <div className="pl-4">
                <span className="text-[#f4ccab]">frontends:</span>
                <span className="text-white/60"> [</span>
                <span className="text-[#caebcc]">"React"</span>
                <span className="text-white/60">, </span>
                <span className="text-[#caebcc]">"Next.js"</span>
                <span className="text-white/60">, </span>
                <span className="text-[#caebcc]">"Tailwind"</span>
                <span className="text-white/60">],</span>
              </div>

              <div className="pl-4">
                <span className="text-[#f4ccab]">deployment:</span>
                <span className="text-white/60"> [</span>
                <span className="text-[#caebcc]">"Docker"</span>
                <span className="text-white/60">, </span>
                <span className="text-[#caebcc]">"AWS"</span>
                <span className="text-white/60">, </span>
                <span className="text-[#caebcc]">"CI/CD"</span>
                <span className="text-white/60">,</span>
                <span className="text-[#caebcc]">"Vercel"</span>
                <span className="text-white/60">]</span>
              </div>

              <div>
                <span className="text-white font-medium">{'}'}</span>
              </div>

              <div className="pt-4 border-t border-white/5 text-[10px] text-white/30 select-none font-mono">
                // Hover inside to project mouse light spotlight.
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}