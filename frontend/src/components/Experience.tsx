'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { 
  Calendar, 
  Building2, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ZoomIn, 
  ZoomOut,
  RotateCw,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  Database
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Internship {
  id: number;
  role: string;
  company: string;
  period: string;
  location: string;
  bullets: string[];
  techStack: string[];
  documentPath: string;
  documentType: 'Offer Letter' | 'Certificate';
  hasAward: boolean;
  awardTitle?: string;
  regNo?: string;
}

const INTERNSHIPS_DATA: Internship[] = [
  {
    id: 1,
    role: 'Full Stack Development Intern',
    company: 'Venturing Digitally (P) Ltd.',
    period: '27 April 2026 — 27 June 2026',
    location: 'Jamshedpur / Bhopal',
    regNo: 'VED/2026/WEBDEV/030',
    documentPath: '/experience/venturing_digitally.png',
    documentType: 'Offer Letter',
    hasAward: false,
    techStack: ['HTML', 'CSS', 'JavaScript', 'React JS', 'Node JS', 'REST APIs', 'Git'],
    bullets: [
      'Joined a highly practical industrial internship focused on full-stack web architectures under mentoring guides.',
      'Gained hands-on exposure to responsive user interface development with React JS and backend system workflows using Node JS.',
      'Completed assigned project tasks, implementing state management, clean component rendering, and modular coding architectures.',
      'Strengthened core understanding of RESTful routing, API integration, and standard client-server communication models.'
    ]
  },
  {
    id: 2,
    role: 'Full Stack Development Intern',
    company: 'PaulTech Software Services (OPC) Pvt. Ltd.',
    period: '05 May 2025 — 07 July 2025',
    location: 'Sakchi, Jamshedpur',
    regNo: 'PSS/302/2025',
    documentPath: '/experience/paultech_services.png',
    documentType: 'Certificate',
    hasAward: true,
    awardTitle: 'Best Intern Award Recipient',
    techStack: ['Full Stack Development', 'Database Management', 'Django', 'Python', 'REST API', 'GIT', 'MySql', 'Figma'],
    bullets: [
      'Successfully completed a comprehensive 2-month professional Full-Stack development internship.',
      'Honored with the prestigious "Best Intern Award" for outstanding code quality, fast learning curves, and proactive contribution.',
      'Assisted in integrating robust database operations, building secure endpoint checks, and optimizing front-to-back connectivity.',
      'Collaborated closely with technical directors to deliver clean, production-ready modules, adhering to modern software lifecycle guidelines.'
    ]
  }
];

export default function Experience() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  
  // Lightbox States
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  // Card Tilt States
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [docTilt, setDocTilt] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const docCardRef = useRef<HTMLDivElement>(null);

  const selectedInternship = INTERNSHIPS_DATA.find(item => item.id === activeTab) || INTERNSHIPS_DATA[0];

  // Ref to sync activeTab with canvas loop
  const activeTabRef = useRef(activeTab);
  useEffect(() => {
    activeTabRef.current = activeTab;
  }, [activeTab]);

  // 1. Floating Rose-Pink & Gold liquid blob canvas animation with interpolation
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    
    // Blob parameters
    const blob = {
      x: canvas.width * 0.7,
      y: canvas.height * 0.5,
      targetX: canvas.width * 0.7,
      targetY: canvas.height * 0.5,
      radius: 260,
      phaseX: 0,
      phaseY: 0,
    };

    // Color palettes to interpolate between
    const PALETTES = [
      {
        c1: [249, 199, 210, 0.14], // Rose Pink
        c2: [122, 84, 93, 0.07],   // Deep Rose
        c3: [192, 132, 252, 0.04]  // Soft Purple Glow
      },
      {
        c1: [255, 199, 0, 0.12],   // Amber Gold
        c2: [161, 98, 7, 0.06],    // Bronze
        c3: [249, 115, 22, 0.04]   // Orange Glow
      }
    ];

    const currentPalette = {
      c1: [249, 199, 210, 0.14],
      c2: [122, 84, 93, 0.07],
      c3: [192, 132, 252, 0.04]
    };

    const resizeBg = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      blob.x = canvas.width * 0.7;
      blob.y = canvas.height * 0.5;
    };

    resizeBg();
    window.addEventListener('resize', resizeBg);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      blob.targetX = canvas.width * 0.7 + (mouseX - canvas.width / 2) * 0.18;
      blob.targetY = canvas.height * 0.5 + (mouseY - canvas.height / 2) * 0.18;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const drawBlob = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep dark base background
      ctx.fillStyle = '#080706';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Interpolate towards active tab palette
      const target = PALETTES[activeTabRef.current - 1] || PALETTES[0];
      const colorEase = 0.03;

      for (let i = 0; i < 4; i++) {
        currentPalette.c1[i] += (target.c1[i] - currentPalette.c1[i]) * colorEase;
        currentPalette.c2[i] += (target.c2[i] - currentPalette.c2[i]) * colorEase;
        currentPalette.c3[i] += (target.c3[i] - currentPalette.c3[i]) * colorEase;
      }

      // Smooth interpolation towards target position
      blob.x += (blob.targetX - blob.x) * 0.05;
      blob.y += (blob.targetY - blob.y) * 0.05;

      // Organic drift
      blob.phaseX += 0.0025;
      blob.phaseY += 0.0018;
      const driftX = Math.sin(blob.phaseX) * 50;
      const driftY = Math.cos(blob.phaseY) * 40;

      const finalX = blob.x + driftX;
      const finalY = blob.y + driftY;

      // Construct gradients
      const grad = ctx.createRadialGradient(
        finalX, finalY, 0,
        finalX, finalY, blob.radius * 1.6
      );
      
      const c1Str = `rgba(${Math.round(currentPalette.c1[0])}, ${Math.round(currentPalette.c1[1])}, ${Math.round(currentPalette.c1[2])}, ${currentPalette.c1[3]})`;
      const c2Str = `rgba(${Math.round(currentPalette.c2[0])}, ${Math.round(currentPalette.c2[1])}, ${Math.round(currentPalette.c2[2])}, ${currentPalette.c2[3]})`;
      const c3Str = `rgba(${Math.round(currentPalette.c3[0])}, ${Math.round(currentPalette.c3[1])}, ${Math.round(currentPalette.c3[2])}, ${currentPalette.c3[3]})`;

      grad.addColorStop(0, c1Str);
      grad.addColorStop(0.35, c2Str);
      grad.addColorStop(0.7, c3Str);
      grad.addColorStop(1, 'rgba(8, 7, 6, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(finalX, finalY, blob.radius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Add ambient drifting specs
      ctx.fillStyle = activeTabRef.current === 1 ? 'rgba(249, 199, 210, 0.1)' : 'rgba(255, 199, 0, 0.08)';
      const pulseSec = Date.now() * 0.001;
      
      ctx.beginPath();
      ctx.arc(
        (canvas.width * 0.3) + Math.sin(pulseSec * 0.2) * 40,
        (canvas.height * 0.4) + Math.cos(pulseSec * 0.15) * 30,
        2.5 + Math.sin(pulseSec) * 1.0,
        0, Math.PI * 2
      );
      ctx.fill();

      ctx.beginPath();
      ctx.arc(
        (canvas.width * 0.75) + Math.cos(pulseSec * 0.18) * 60,
        (canvas.height * 0.25) + Math.sin(pulseSec * 0.22) * 50,
        1.8 + Math.cos(pulseSec) * 0.8,
        0, Math.PI * 2
      );
      ctx.fill();

      animFrame = requestAnimationFrame(drawBlob);
    };

    drawBlob();

    return () => {
      window.removeEventListener('resize', resizeBg);
      container.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // 2. Stagger entrance reveal using GSAP ScrollTrigger
  useEffect(() => {
    const section = containerRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.exp-reveal-header', 
        { opacity: 0, y: 35 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.75, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );

      gsap.fromTo('.exp-reveal-content', 
        { opacity: 0, y: 45 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.85, 
          delay: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // 3. Tab switching animation with staggers
  const handleTabChange = (id: number) => {
    if (id === activeTab) return;
    
    // Animate out elements
    gsap.to([
      '.exp-animate-title',
      '.exp-animate-award',
      '.exp-animate-bullet',
      '.exp-animate-tech',
      '.exp-animate-doc'
    ], {
      opacity: 0,
      y: 12,
      stagger: 0.04,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        setActiveTab(id);
        
        // Let state update render first, then trigger stagger entrance
        setTimeout(() => {
          gsap.fromTo('.exp-animate-title', 
            { opacity: 0, x: -15, y: 0 },
            { opacity: 1, x: 0, y: 0, duration: 0.45, ease: 'power2.out' }
          );
          
          gsap.fromTo('.exp-animate-award', 
            { opacity: 0, scale: 0.88, y: 5 },
            { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'back.out(1.6)' }
          );

          gsap.fromTo('.exp-animate-bullet',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, stagger: 0.08, duration: 0.45, ease: 'power2.out' }
          );
          
          gsap.fromTo('.exp-animate-tech',
            { opacity: 0, scale: 0.82, y: 5 },
            { opacity: 1, scale: 1, y: 0, stagger: 0.03, duration: 0.35, ease: 'power2.out' }
          );
          
          gsap.fromTo('.exp-animate-doc',
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
          );
        }, 30);
      }
    });
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseDoc();
      }
    };
    if (activeDoc) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeDoc]);

  // Clean lightbox close
  const handleCloseDoc = () => {
    setActiveDoc(null);
    setScale(1);
    setRotation(0);
  };

  // Card Mouse Move spotlight + tilt
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    // Rotate bounds max 6 degrees
    const rotateX = ((y / rect.height) - 0.5) * -6;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: -1000, y: -1000 });
  };

  // Document Card Mouse Move tilt
  const handleDocMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = docCardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = ((y / rect.height) - 0.5) * -9;
    const rotateY = ((x / rect.width) - 0.5) * 9;
    setDocTilt({ x: rotateX, y: rotateY });
  };

  const handleDocMouseLeave = () => {
    setDocTilt({ x: 0, y: 0 });
  };

  return (
    <section 
      ref={containerRef}
      className="w-full bg-[#080706] text-[#FAF6EE] py-24 md:py-32 border-t border-[#d3c2c5]/15 relative overflow-hidden"
      id="experience"
    >
      {/* 1. Background Blob Animation Canvas */}
      <canvas 
        ref={bgCanvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      />

      {/* 2. Overlaid Frosted Columns Grid */}
      <div className="absolute inset-0 w-full h-full grid grid-cols-6 md:grid-cols-12 pointer-events-none z-1">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div 
            key={idx} 
            className={`h-full w-full border-r border-white/[0.03] backdrop-blur-[8px] ${
              idx >= 6 ? 'hidden md:block' : ''
            }`} 
          />
        ))}
      </div>

      {/* Subtle overlay grid pattern */}
      <div className="absolute inset-0 opacity-[0.012] bg-[radial-gradient(#FAF6EE_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none z-2" />

      {/* 3. Experience Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 relative z-10">
        
        {/* Section Header */}
        <div className="mb-20 select-none text-left exp-reveal-header">
          <span className="font-mono text-xs text-[#f9c7d2] uppercase tracking-widest block mb-2 font-bold">
            Interactive Journey
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF6EE] uppercase">
            EXPERIENCE
          </h2>
          <div className="w-12 h-1 bg-[#f9c7d2] mt-4 rounded-full" />
        </div>

        {/* Dynamic Grid Layout */}
        <div className="flex flex-col lg:flex-row gap-12 items-start exp-reveal-content">
          
          {/* Left Column: Timeline Visualizer + Switcher Tabs */}
          <div className="w-full lg:w-1/3 flex flex-col gap-8">
            
            {/* Desktop Timeline + Buttons Container */}
            <div className="hidden lg:flex items-stretch gap-6">
              {/* Timeline Column */}
              <div className="flex flex-col items-center justify-between py-6 relative select-none">
                
                {/* Node 1 */}
                <div 
                  onClick={() => handleTabChange(1)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 cursor-pointer z-10 relative group ${
                    activeTab === 1 
                      ? 'bg-[#f9c7d2]/15 border-[#f9c7d2] text-[#f9c7d2] shadow-[0_0_20px_rgba(249,199,210,0.45)]' 
                      : 'bg-[#141211]/90 border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                  }`}
                >
                  <Laptop className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  {activeTab === 1 && (
                    <span className="absolute -inset-1.5 rounded-xl border border-[#f9c7d2]/50 animate-ping opacity-60 pointer-events-none" />
                  )}
                </div>

                {/* Connecting Line */}
                <div className="w-1 flex-grow min-h-[90px] my-4 relative bg-white/5 overflow-hidden rounded-full">
                  <div 
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#f9c7d2] to-[#ffc700] transition-all duration-700 ease-in-out"
                    style={{
                      height: activeTab === 2 ? '100%' : '0%'
                    }}
                  />
                </div>

                {/* Node 2 */}
                <div 
                  onClick={() => handleTabChange(2)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 cursor-pointer z-10 relative group ${
                    activeTab === 2 
                      ? 'bg-[#ffc700]/15 border-[#ffc700] text-[#ffc700] shadow-[0_0_20px_rgba(255,199,0,0.45)]' 
                      : 'bg-[#141211]/90 border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                  }`}
                >
                  <Database className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                  {activeTab === 2 && (
                    <span className="absolute -inset-1.5 rounded-xl border border-[#ffc700]/50 animate-ping opacity-60 pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Buttons Column */}
              <div className="flex flex-col justify-between py-2 flex-grow gap-8">
                {INTERNSHIPS_DATA.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`text-left px-6 py-5 rounded-2xl border transition-all duration-500 cursor-pointer w-full flex flex-col gap-1.5 relative overflow-hidden group ${
                      activeTab === item.id 
                        ? 'bg-white/10 border-white/15 text-white shadow-lg' 
                        : 'bg-transparent border-transparent text-white/50 hover:text-white/80 hover:bg-white/[0.02]'
                    }`}
                  >
                    {/* Glowing Left Border Indicator */}
                    <div 
                      className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-500 ${
                        activeTab === item.id 
                          ? item.id === 1 ? 'bg-[#f9c7d2]' : 'bg-[#ffc700]'
                          : 'bg-transparent'
                      }`}
                    />
                    <span className="font-mono text-[10px] font-bold text-white/40 uppercase tracking-widest">
                      {item.period.split('—')[1]?.trim() || 'PRESENT'}
                    </span>
                    <span className="font-serif text-lg font-bold truncate">
                      {item.company.split('(')[0]}
                    </span>
                    <span className="font-sans text-xs text-white/60 font-light truncate">
                      {item.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile Timeline + Buttons */}
            <div className="flex lg:hidden flex-col gap-6 w-full">
              {/* Horizontal Timeline */}
              <div className="flex items-center justify-center w-full relative px-6 select-none">
                {/* Node 1 */}
                <div 
                  onClick={() => handleTabChange(1)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 cursor-pointer z-10 relative group ${
                    activeTab === 1 
                      ? 'bg-[#f9c7d2]/15 border-[#f9c7d2] text-[#f9c7d2] shadow-[0_0_20px_rgba(249,199,210,0.4)]' 
                      : 'bg-[#141211]/90 border-white/10 text-white/40'
                  }`}
                >
                  <Laptop className="w-5 h-5" />
                  {activeTab === 1 && (
                    <span className="absolute -inset-1.5 rounded-xl border border-[#f9c7d2]/50 animate-ping opacity-60 pointer-events-none" />
                  )}
                </div>

                {/* Connecting Line */}
                <div className="h-1 flex-grow max-w-[150px] mx-4 relative bg-white/5 overflow-hidden rounded-full">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#f9c7d2] to-[#ffc700] transition-all duration-700 ease-in-out"
                    style={{
                      width: activeTab === 2 ? '100%' : '0%'
                    }}
                  />
                </div>

                {/* Node 2 */}
                <div 
                  onClick={() => handleTabChange(2)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 cursor-pointer z-10 relative group ${
                    activeTab === 2 
                      ? 'bg-[#ffc700]/15 border-[#ffc700] text-[#ffc700] shadow-[0_0_20px_rgba(255,199,0,0.4)]' 
                      : 'bg-[#141211]/90 border-white/10 text-white/40'
                  }`}
                >
                  <Database className="w-5 h-5" />
                  {activeTab === 2 && (
                    <span className="absolute -inset-1.5 rounded-xl border border-[#ffc700]/50 animate-ping opacity-60 pointer-events-none" />
                  )}
                </div>
              </div>

              {/* Horizontal buttons list */}
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1 justify-center">
                {INTERNSHIPS_DATA.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex-shrink-0 text-left px-5 py-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
                      activeTab === item.id 
                        ? 'bg-white/10 border-white/15 text-white shadow-md' 
                        : 'bg-transparent border-transparent text-white/40 hover:text-white/70'
                    }`}
                  >
                    <span className="block font-mono text-[9px] font-bold text-white/40 uppercase tracking-widest mb-0.5">
                      {item.period.split('—')[1]?.trim() || 'PRESENT'}
                    </span>
                    <span className="font-serif text-sm font-semibold block">
                      {item.company.split('(')[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Detail Card */}
          <div className="w-full lg:w-2/3">
            <div 
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
              }}
              className="w-full bg-[#141211]/85 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md relative overflow-hidden group/card shadow-2xl transition-colors duration-500 flex flex-col justify-between"
            >
              {/* Spotlight background overlays */}
              <div 
                className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-0"
                style={{
                  background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(249, 199, 210, 0.05), transparent 80%)`
                }}
              />
              
              <div 
                className="absolute inset-0 pointer-events-none rounded-3xl border border-[#f9c7d2]/15 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-1"
                style={{
                  maskImage: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`,
                  WebkitMaskImage: `radial-gradient(180px circle at ${mousePos.x}px ${mousePos.y}px, black, transparent)`
                }}
              />

              <div className="relative z-10">
                {/* Header Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 mb-6">
                  <div className="exp-animate-title">
                    <h3 className="font-serif text-2xl md:text-3xl font-bold text-white mb-1 group-hover/card:text-[#f9c7d2] transition-colors duration-300">
                      {selectedInternship.role}
                    </h3>
                    <h4 className="font-sans text-base md:text-lg font-medium text-[#f9c7d2] flex items-center gap-2">
                      <Building2 className="w-4 h-4 opacity-70" />
                      {selectedInternship.company}
                    </h4>
                  </div>
                  
                  <div className="flex flex-col md:items-end gap-1.5 flex-shrink-0 exp-reveal-title">
                    <span className="flex items-center gap-1.5 text-xs font-mono text-white/50 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full w-fit">
                      <Calendar className="w-3.5 h-3.5 text-[#f9c7d2]" />
                      {selectedInternship.period}
                    </span>
                    <span className="text-[10px] font-mono text-white/30 text-left md:text-right uppercase tracking-wider">
                      Reg. No: {selectedInternship.regNo}
                    </span>
                  </div>
                </div>

                {/* Best Intern Award Spotlight Badge */}
                {selectedInternship.hasAward && (
                  <div className="exp-animate-award flex items-center gap-2.5 mb-6 w-fit relative group/award">
                    <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-[#ffc700] to-yellow-600 rounded-full blur opacity-35 group-hover/award:opacity-65 transition duration-500 animate-pulse" />
                    
                    <div className="relative flex items-center gap-2.5 bg-[#1d190b] border border-[#ffc700]/40 text-[#ffc700] px-5 py-2 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_15px_rgba(255,199,0,0.1)]">
                      <Award className="w-4 h-4 animate-bounce text-[#ffc700]" />
                      <span className="bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 bg-clip-text text-transparent">
                        {selectedInternship.awardTitle}
                      </span>
                      <Sparkles className="w-3.5 h-3.5 text-[#ffc700] animate-pulse ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Bullets List */}
                <div className="space-y-4 mb-8">
                  {selectedInternship.bullets.map((bullet, i) => (
                    <div key={i} className="exp-animate-bullet flex items-start gap-3.5 text-sm md:text-base">
                      <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 transition-colors duration-300 ${
                        selectedInternship.id === 1 ? 'text-[#f9c7d2]' : 'text-[#ffc700]'
                      }`} />
                      <p className="font-sans text-white/80 font-light leading-relaxed">
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Tech Stack Tags */}
                <div className="mb-6 border-t border-white/5 pt-6">
                  <h5 className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-3.5">Technologies Leveraged</h5>
                  <div className="flex flex-wrap gap-2.5">
                    {selectedInternship.techStack.map((tech, i) => (
                      <span 
                        key={i} 
                        className="exp-animate-tech bg-white/[0.03] border border-white/5 text-white/70 font-mono text-xs px-3.5 py-1.5 rounded-xl hover:bg-white/10 hover:border-[#f9c7d2]/25 hover:text-white transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 cursor-default select-none flex items-center gap-2"
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          selectedInternship.id === 1 ? 'bg-[#f9c7d2]/60' : 'bg-[#ffc700]/60'
                        }`} />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3D Glassmorphic Document Folder Preview */}
              <div 
                ref={docCardRef}
                onMouseMove={handleDocMouseMove}
                onMouseLeave={handleDocMouseLeave}
                onClick={() => setActiveDoc(selectedInternship.documentPath)}
                style={{
                  transform: `perspective(800px) rotateX(${docTilt.x}deg) rotateY(${docTilt.y}deg)`,
                  transition: 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s ease'
                }}
                className="exp-animate-doc mt-4 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer group/doc transition-all relative overflow-hidden"
              >
                <div 
                  className="absolute -right-16 -top-16 w-32 h-32 rounded-full blur-2xl opacity-10 group-hover/doc:opacity-20 transition-opacity pointer-events-none"
                  style={{
                    background: selectedInternship.id === 1 ? '#f9c7d2' : '#ffc700'
                  }}
                />

                <div className="flex items-center gap-4">
                  {/* Interactive 3D Miniature Frame */}
                  <div className="relative w-16 h-20 bg-black/40 border border-white/10 rounded-xl overflow-hidden flex-shrink-0 group-hover/doc:border-white/20 transition-all flex items-center justify-center p-1">
                    <Image
                      src={selectedInternship.documentPath}
                      alt="Credential preview"
                      width={60}
                      height={76}
                      className="object-contain w-full h-full rounded opacity-75 group-hover/doc:opacity-100 group-hover/doc:scale-105 transition-all duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-50 pointer-events-none" />
                  </div>

                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Verification Link</span>
                      <span className="flex items-center gap-1 text-[8px] font-mono font-bold bg-[#10b981]/15 border border-[#10b981]/25 text-[#10b981] px-2 py-0.5 rounded-full">
                        <span className="w-1 h-1 rounded-full bg-[#10b981] animate-pulse" />
                        VERIFIED
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-white/95 group-hover/doc:text-[#f9c7d2] transition-colors duration-300">
                      {selectedInternship.documentType === 'Certificate' 
                        ? 'Internship Completion Certificate' 
                        : 'Internship Opportunity Offer Letter'}
                    </span>
                    <span className="block text-[10px] text-white/50 font-mono mt-0.5">
                      Format: Portable Document Image (PNG)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center text-xs font-mono text-white/40 group-hover/doc:text-[#f9c7d2] transition-colors pr-2">
                  <span>View Immersive Document</span>
                  <ZoomIn className="w-4 h-4 transition-transform duration-300 group-hover/doc:scale-110" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* 4. Document Lightbox Modal */}
      {activeDoc && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-2xl p-4 md:p-8 animate-fade-in"
          onClick={handleCloseDoc}
        >
          <div 
            className="relative w-full max-w-4xl bg-[#141211] text-[#FAF6EE] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Controls Header */}
            <div className="p-5 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left bg-black/20 z-20">
              <div>
                <h4 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                  {selectedInternship.company}
                  {selectedInternship.hasAward && <Award className="w-4.5 h-4.5 text-[#ffc700] fill-[#ffc700]/10" />}
                </h4>
                <p className="font-sans text-xs text-[#f9c7d2] font-light mt-0.5">
                  {selectedInternship.role} — {selectedInternship.documentType}
                </p>
              </div>
              
              {/* Verification and Clipboard Copy */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 text-xs font-mono">
                  <span className="text-white/40">REG:</span>
                  <span className="text-white/80">{selectedInternship.regNo}</span>
                  <button 
                    onClick={() => {
                      if (selectedInternship.regNo) {
                        navigator.clipboard.writeText(selectedInternship.regNo);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }
                    }}
                    className="text-[#f9c7d2] hover:text-white transition-colors ml-1 cursor-pointer"
                    title="Copy registration number"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                
                <button 
                  onClick={handleCloseDoc}
                  className="bg-white/5 hover:bg-white/10 text-white hover:text-[#f9c7d2] p-2 rounded-xl border border-white/10 transition-all cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Image Viewer Area */}
            <div className="relative w-full flex-grow h-[55vh] md:h-[60vh] bg-black/60 flex items-center justify-center overflow-auto p-6 cursor-grab active:cursor-grabbing">
              <div 
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                  transition: 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)'
                }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image
                  src={activeDoc}
                  alt={`${selectedInternship.company} ${selectedInternship.documentType}`}
                  fill
                  priority
                  sizes="(max-w-1024px) 100vw, 80vw"
                  className="object-contain p-2"
                />
              </div>
            </div>

            {/* Interactive Tool Toolbar */}
            <div className="p-4 border-t border-white/5 bg-black/35 flex items-center justify-center gap-4 z-20">
              <button
                onClick={() => setScale(prev => Math.max(0.5, prev - 0.25))}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white border border-white/5 transition-all cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4.5 h-4.5" />
              </button>

              <span className="font-mono text-xs text-white/50 w-12 text-center">
                {Math.round(scale * 100)}%
              </span>

              <button
                onClick={() => setScale(prev => Math.min(3, prev + 0.25))}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white border border-white/5 transition-all cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4.5 h-4.5" />
              </button>

              <div className="w-px h-6 bg-white/10 mx-2" />

              <button
                onClick={() => setRotation(prev => (prev + 90) % 360)}
                className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-white/70 hover:text-white border border-white/5 transition-all cursor-pointer"
                title="Rotate 90°"
              >
                <RotateCw className="w-4.5 h-4.5" />
              </button>

              <button
                onClick={() => { setScale(1); setRotation(0); }}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-mono text-white/70 hover:text-white border border-white/5 transition-all cursor-pointer"
              >
                Reset View
              </button>

              <a
                href={activeDoc}
                download={`${selectedInternship.company.replace(/\s+/g, '_')}_${selectedInternship.documentType}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-[#f9c7d2] hover:bg-white text-black font-semibold rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Embedded CSS for transitions and keyframes */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        .animate-scale-up {
          animation: scaleUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        
        /* Floating Animation keyframes */
        @keyframes floatAward {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        .group\/award {
          animation: floatAward 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}