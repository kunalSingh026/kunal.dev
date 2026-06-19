'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Award, Calendar, Building2, X, Sparkles, ShieldCheck, Code, Users, Terminal as TerminalIcon, Activity } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Achievement {
  id: number;
  title: string;
  subtitle: string;
  institution: string;
  date: string;
  details: string;
  imagePath: string;
  category: 'HACKATHON' | 'OPEN SOURCE' | 'CERTIFICATION' | 'COMMUNITY' | 'PROJECT';
  gridClass: string;
}

const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: 1,
    title: 'Smart India Hackathon 2025',
    subtitle: 'Internal Round Qualifier Certificate',
    institution: 'Netaji Subhas University, Jamshedpur',
    date: 'January 2025',
    details: 'Successfully qualified in the Internal Hackathon Round for the prestigious Smart India Hackathon (SIH) 2025. Honored to represent Netaji Subhas University School of IT, working under guidance to design and build technology-driven solutions for real-world national problems.',
    imagePath: '/achievements/sih_2025.png',
    category: 'HACKATHON',
    gridClass: 'col-span-1 md:col-span-2 row-span-1 md:h-[350px]'
  },
  {
    id: 2,
    title: 'GirlScript Summer of Code 2026',
    subtitle: 'Open Source Contributor',
    institution: 'GirlScript Foundation',
    date: 'Summer 2026',
    details: 'Selected as an official contributor for GSSoC 2026. Actively writing code, fixing issues, and shipping features to major open-source repositories. Embracing collaborative workflows, peer code reviews, and git-based deployment protocols alongside developers worldwide.',
    imagePath: '/achievements/gssoc_2026.png',
    category: 'OPEN SOURCE',
    gridClass: 'col-span-1 md:col-span-1 row-span-1 md:h-[350px]'
  },
  {
    id: 3,
    title: 'Cyber Threat Intelligence 101',
    subtitle: 'Foundation Level Analyst Certification',
    institution: 'arcX Training & Certification',
    date: 'July 2025',
    details: 'Earned the Foundation Level Threat Intelligence Analyst certification by passing the arcX examinations. Gained hands-on knowledge in identifying threats, analyzing attacker motives, mapping indicator of compromise (IoC) pathways, and deploying cyber intelligence frameworks.',
    imagePath: '/achievements/arcx_security.jpg',
    category: 'CERTIFICATION',
    gridClass: 'col-span-1 md:col-span-1 row-span-1 md:h-[350px]'
  },
  {
    id: 4,
    title: 'GDG DevFest Ranchi 2025',
    subtitle: 'Developer Community Engagement & Swag',
    institution: 'Google Developer Groups Ranchi',
    date: 'December 2025',
    details: 'Participated in DevFest Ranchi 2025, attending deep-dives on Google Cloud, web development ecosystems, and AI integrations. Built strong local community ties, exchanged deployment workflows with industry professionals, and collected hands-on developer swag.',
    imagePath: '/achievements/devfest_2025.jpg',
    category: 'COMMUNITY',
    gridClass: 'col-span-1 md:col-span-1 row-span-1 md:h-[350px]'
  },
  // Custom Card 5 will sit in grid position 5 (Interactive Nodes)
  {
    id: 5,
    title: 'Project Omnis Showcase',
    subtitle: 'AI-Powered Custom Roadmap Generator',
    institution: 'Collaborative Hackathon Build',
    date: '2025',
    details: 'Designed and deployed "Omnis", a multi-terminal AI application generating personalized learning journeys. The showcase features three local machines running frontend and backend components synchronously to demonstrate instant custom roadmap synthesis.',
    imagePath: '/achievements/omnis_project.jpg',
    category: 'PROJECT',
    gridClass: 'col-span-1 md:col-span-2 row-span-1 md:h-[350px]'
  }
  // Custom Card 7 will sit in grid position 7 (Retro Terminal)
];

// Interactive Constellation/Nodes Canvas Card Component
function ConstellationCard() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const points: Array<{ x: number; y: number; vx: number; vy: number; radius: number }> = [];
    const maxPoints = 26;

    const initCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);

    // Initialize points
    for (let i = 0; i < maxPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        radius: Math.random() * 1.5 + 1
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw faint background grid in card
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const step = 20;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw nodes and links
      const mouse = mouseRef.current;

      // Update positions
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wall collisions
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Mouse attraction
        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            p.x += dx * 0.02;
            p.y += dy * 0.02;
          }
        }

        // Draw point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249, 199, 210, 0.7)'; // primary container color highlight
        ctx.fill();
      });

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 65) {
            const alpha = (1 - dist / 65) * 0.25;
            ctx.strokeStyle = `rgba(250, 246, 238, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Connect to mouse
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            const alpha = (1 - dist / 90) * 0.4;
            ctx.strokeStyle = `rgba(249, 199, 210, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: null, y: null };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', initCanvas);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="col-span-1 row-span-1 md:h-[350px] rounded-2xl overflow-hidden border border-[#d3c2c5]/15 bg-[#171513]/85 backdrop-blur-md flex flex-col justify-between p-6 relative group select-none shadow-sm hover:shadow-xl hover:border-[#f9c7d2]/20 transition-all duration-500 ease-out"
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
      
      {/* Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono text-[#f9c7d2] tracking-wider uppercase font-semibold">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Nodes Network</span>
        </div>
        <span className="text-[10px] font-mono text-white/30">ONLINE</span>
      </div>

      {/* Center Graphic Title */}
      <div className="relative z-10 my-auto text-center py-6">
        <h4 className="font-serif text-lg font-bold text-[#FAF6EE] group-hover:text-[#f9c7d2] transition-colors mb-2">
          Interactive Web Sandbox
        </h4>
        <p className="font-sans text-xs text-white/50 leading-relaxed max-w-[200px] mx-auto">
          Hover over the mesh network to distort and attract particles in real-time.
        </p>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between text-[10px] font-mono text-white/30 border-t border-white/5 pt-3">
        <span>GPU_ACCELERATED</span>
        <span>FPS: 60</span>
      </div>
    </div>
  );
}

// Retro Dev Terminal Card Component
function TerminalCard() {
  const [logs, setLogs] = useState<string[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allLogs = [
    'System initialization...',
    'Loading credentials...',
    'Spinning up Docker clusters...',
    'Connecting database... OK',
    'Checking Django API... ONLINE',
    'Fetching commit logs... DONE',
    'Deploying portfolio frontend...',
    'Integrating GSAP scrolltriggers...',
    'Compiling assets...',
    'System Status: READY & SECURE',
    'Welcome Kunal Kumar Singh!',
    'Running main event listeners...',
    'Checking webhook events... OK',
    'Initializing Bento grid...',
    'Rendering achievements lightbox...'
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let logIdx = 0;
    
    // Add logs one by one
    const appendLog = () => {
      setLogs((prev) => {
        const next = [...prev, `> ${allLogs[logIdx]}`];
        if (next.length > 7) {
          next.shift(); // Keep maximum 7 lines
        }
        return next;
      });

      logIdx = (logIdx + 1) % allLogs.length;
      
      // Random delay for organic terminal look
      const nextDelay = Math.random() * 2000 + 1000;
      timer = setTimeout(appendLog, nextDelay);
    };

    // Initial delay
    timer = setTimeout(appendLog, 500);

    return () => clearTimeout(timer);
  }, []);

  // Handle Spotlight Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = containerRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="col-span-1 row-span-1 md:h-[350px] rounded-2xl overflow-hidden border border-[#d3c2c5]/15 bg-[#171513]/85 backdrop-blur-md flex flex-col p-5 relative group select-none shadow-sm hover:shadow-xl hover:border-[#f9c7d2]/20 transition-all duration-500 ease-out"
      style={{
        '--mouse-x': '0px',
        '--mouse-y': '0px',
      } as React.CSSProperties}
    >
      {/* Dynamic Mouse Spotlight Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-1"
        style={{
          background: `radial-gradient(200px circle at var(--mouse-x) var(--mouse-y), rgba(249, 199, 210, 0.08), transparent 80%)`
        }}
      />

      {/* Terminal Title Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-3 mb-4">
        <div className="flex items-center gap-2">
          {/* Mac-style dots */}
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#f9c7d2]/40" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/10" />
          </div>
          <span className="text-[10px] font-mono text-white/40 ml-1">kunal@terminal:~</span>
        </div>
        <TerminalIcon className="w-3.5 h-3.5 text-white/30" />
      </div>

      {/* Console output area */}
      <div className="relative z-10 flex-grow font-mono text-[11px] text-white/70 leading-relaxed flex flex-col justify-start">
        {logs.map((log, i) => (
          <div 
            key={i} 
            className={`transition-all duration-300 ${
              i === logs.length - 1 ? 'text-[#f9c7d2]' : ''
            }`}
          >
            {log}
          </div>
        ))}
        {/* Blinking cursor */}
        <div className="flex items-center gap-1 mt-1 text-[#f9c7d2]">
          <span>{'>'}</span>
          <span className="w-1.5 h-3 bg-[#f9c7d2] animate-pulse" />
        </div>
      </div>

      {/* Grid footer info */}
      <div className="relative z-10 mt-auto pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-white/30">
        <span>SHELL: POWERSHELL</span>
        <span>STATUS: DEPLOYED</span>
      </div>
    </div>
  );
}

export default function Achievements() {
  const [activeItem, setActiveItem] = useState<Achievement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 1. Flowing Ribbon Waves Background Animation
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    let phase = 0;

    const resizeBg = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    resizeBg();
    window.addEventListener('resize', resizeBg);

    // Draw flowing ribbons (similar to the black wave image)
    const drawWaves = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep dark base gradient
      const baseGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      baseGrad.addColorStop(0, '#0c0a09'); // rich dark charcoal
      baseGrad.addColorStop(0.5, '#070605'); // deep black
      baseGrad.addColorStop(1, '#0c0a09');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.005)';
      ctx.lineWidth = 1;
      const spacing = 40;
      for (let x = 0; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += spacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw sine-wave ribbons
      const ribbons = [
        { yOffset: 0.35, amp: 85, freq: 0.002, speed: 0.004, lines: 16 },
        { yOffset: 0.55, amp: 110, freq: 0.0015, speed: -0.003, lines: 20 },
        { yOffset: 0.75, amp: 70, freq: 0.0025, speed: 0.005, lines: 14 }
      ];

      ribbons.forEach((ribbon) => {
        const centerY = canvas.height * ribbon.yOffset;
        
        for (let l = 0; l < ribbon.lines; l++) {
          // Fade outer lines of the ribbon
          const edgeFactor = 1 - Math.abs(l - ribbon.lines / 2) / (ribbon.lines / 2);
          const alpha = edgeFactor * 0.07; // Very soft opacity to avoid glare
          
          ctx.strokeStyle = `rgba(250, 246, 238, ${alpha})`;
          ctx.lineWidth = 0.5 + edgeFactor * 0.5;

          ctx.beginPath();
          
          // Draw horizontal points
          for (let x = 0; x < canvas.width; x += 15) {
            // Combine multiple sine frequencies for organic curves
            const sineInput = x * ribbon.freq + phase * ribbon.speed + (l * 0.09);
            const secondaryInput = x * 0.005 + phase * 0.002;
            
            const displacement = 
              Math.sin(sineInput) * ribbon.amp + 
              Math.cos(secondaryInput) * (ribbon.amp * 0.25);
              
            const y = centerY + displacement;

            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          
          ctx.stroke();
        }
      });

      phase += 1;
      animFrame = requestAnimationFrame(drawWaves);
    };

    drawWaves();

    return () => {
      window.removeEventListener('resize', resizeBg);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // 2. Stagger reveal cards using GSAP ScrollTrigger
  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean);
    if (cards.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { 
          opacity: 0, 
          y: 60,
          scale: 0.95
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  // 3. Card Mouse Spotlight Tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const card = cardsRef.current[idx];
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  // Category Icon helper
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'HACKATHON':
        return <Award className="w-4 h-4 text-[#FAF6EE]" />;
      case 'OPEN SOURCE':
        return <Code className="w-4 h-4 text-[#FAF6EE]" />;
      case 'CERTIFICATION':
        return <ShieldCheck className="w-4 h-4 text-[#FAF6EE]" />;
      case 'COMMUNITY':
        return <Users className="w-4 h-4 text-[#FAF6EE]" />;
      default:
        return <Sparkles className="w-4 h-4 text-[#FAF6EE]" />;
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveItem(null);
      }
    };
    if (activeItem) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [activeItem]);

  return (
    <section 
      ref={containerRef}
      className="w-full bg-[#0c0a09] text-[#FAF6EE] py-24 md:py-32 border-t border-[#d3c2c5]/15 relative overflow-hidden"
      id="achievements"
    >
      {/* Wave Ribbon Animation Canvas */}
      <canvas 
        ref={bgCanvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      />

      <div className="max-w-7xl mx-auto px-8 md:px-16 lg:px-24 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 select-none text-left">
          <span className="font-mono text-xs text-[#f9c7d2] uppercase tracking-widest block mb-2 font-bold">
            Certificates, Badges & Events
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF6EE] uppercase">
            ACHIEVEMENTS
          </h2>
          <div className="w-12 h-1 bg-[#f9c7d2] mt-4 rounded-full" />
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:auto-rows-fr">
          {/* Card 1: SIH 2025 */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            onMouseMove={(e) => handleMouseMove(e, 0)}
            onClick={() => setActiveItem(ACHIEVEMENTS_DATA[0])}
            className={`${ACHIEVEMENTS_DATA[0].gridClass} group relative rounded-2xl overflow-hidden border border-[#d3c2c5]/15 bg-[#171513]/85 backdrop-blur-md cursor-pointer shadow-sm hover:shadow-xl hover:border-[#f9c7d2]/25 transition-all duration-500 ease-out flex flex-col justify-end p-6 md:p-8`}
            style={{ '--mouse-x': '0px', '--mouse-y': '0px' } as React.CSSProperties}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={ACHIEVEMENTS_DATA[0].imagePath}
                alt={ACHIEVEMENTS_DATA[0].title}
                fill
                sizes="(max-w-768px) 100vw, 66vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out opacity-25 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/70 to-[#171513]/30 z-1" />
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-2"
                 style={{ background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(249, 199, 210, 0.08), transparent 80%)` }} />
            <div className="relative z-10 text-white flex flex-col justify-end h-full min-h-[160px] md:min-h-0 pointer-events-none">
              <div className="flex items-center gap-2 mb-3 bg-white/10 border border-white/5 w-fit px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-[#f9c7d2]">
                {getCategoryIcon(ACHIEVEMENTS_DATA[0].category)}
                <span>{ACHIEVEMENTS_DATA[0].category}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mb-1 group-hover:text-[#f9c7d2] transition-colors duration-300">
                {ACHIEVEMENTS_DATA[0].title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-white/70 font-medium mb-3">
                {ACHIEVEMENTS_DATA[0].subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-white/40 border-t border-white/5 pt-3 mt-1">
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[0].institution.split(',')[0]}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[0].date}</span>
              </div>
            </div>
          </div>

          {/* Card 2: GSSoC 2026 */}
          <div
            ref={(el) => { cardsRef.current[1] = el; }}
            onMouseMove={(e) => handleMouseMove(e, 1)}
            onClick={() => setActiveItem(ACHIEVEMENTS_DATA[1])}
            className={`${ACHIEVEMENTS_DATA[1].gridClass} group relative rounded-2xl overflow-hidden border border-[#d3c2c5]/15 bg-[#171513]/85 backdrop-blur-md cursor-pointer shadow-sm hover:shadow-xl hover:border-[#f9c7d2]/25 transition-all duration-500 ease-out flex flex-col justify-end p-6 md:p-8`}
            style={{ '--mouse-x': '0px', '--mouse-y': '0px' } as React.CSSProperties}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={ACHIEVEMENTS_DATA[1].imagePath}
                alt={ACHIEVEMENTS_DATA[1].title}
                fill
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out opacity-25 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/70 to-[#171513]/30 z-1" />
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-2"
                 style={{ background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(249, 199, 210, 0.08), transparent 80%)` }} />
            <div className="relative z-10 text-white flex flex-col justify-end h-full min-h-[160px] md:min-h-0 pointer-events-none">
              <div className="flex items-center gap-2 mb-3 bg-white/10 border border-white/5 w-fit px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-[#f9c7d2]">
                {getCategoryIcon(ACHIEVEMENTS_DATA[1].category)}
                <span>{ACHIEVEMENTS_DATA[1].category}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mb-1 group-hover:text-[#f9c7d2] transition-colors duration-300">
                {ACHIEVEMENTS_DATA[1].title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-white/70 font-medium mb-3">
                {ACHIEVEMENTS_DATA[1].subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-white/40 border-t border-white/5 pt-3 mt-1">
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[1].institution.split(',')[0]}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[1].date}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Cyber Threat Intelligence 101 */}
          <div
            ref={(el) => { cardsRef.current[2] = el; }}
            onMouseMove={(e) => handleMouseMove(e, 2)}
            onClick={() => setActiveItem(ACHIEVEMENTS_DATA[2])}
            className={`${ACHIEVEMENTS_DATA[2].gridClass} group relative rounded-2xl overflow-hidden border border-[#d3c2c5]/15 bg-[#171513]/85 backdrop-blur-md cursor-pointer shadow-sm hover:shadow-xl hover:border-[#f9c7d2]/25 transition-all duration-500 ease-out flex flex-col justify-end p-6 md:p-8`}
            style={{ '--mouse-x': '0px', '--mouse-y': '0px' } as React.CSSProperties}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={ACHIEVEMENTS_DATA[2].imagePath}
                alt={ACHIEVEMENTS_DATA[2].title}
                fill
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out opacity-25 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/70 to-[#171513]/30 z-1" />
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-2"
                 style={{ background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(249, 199, 210, 0.08), transparent 80%)` }} />
            <div className="relative z-10 text-white flex flex-col justify-end h-full min-h-[160px] md:min-h-0 pointer-events-none">
              <div className="flex items-center gap-2 mb-3 bg-white/10 border border-white/5 w-fit px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-[#f9c7d2]">
                {getCategoryIcon(ACHIEVEMENTS_DATA[2].category)}
                <span>{ACHIEVEMENTS_DATA[2].category}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mb-1 group-hover:text-[#f9c7d2] transition-colors duration-300">
                {ACHIEVEMENTS_DATA[2].title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-white/70 font-medium mb-3">
                {ACHIEVEMENTS_DATA[2].subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-white/40 border-t border-white/5 pt-3 mt-1">
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[2].institution.split(',')[0]}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[2].date}</span>
              </div>
            </div>
          </div>

          {/* Card 4: GDG DevFest Ranchi 2025 */}
          <div
            ref={(el) => { cardsRef.current[3] = el; }}
            onMouseMove={(e) => handleMouseMove(e, 3)}
            onClick={() => setActiveItem(ACHIEVEMENTS_DATA[3])}
            className={`${ACHIEVEMENTS_DATA[3].gridClass} group relative rounded-2xl overflow-hidden border border-[#d3c2c5]/15 bg-[#171513]/85 backdrop-blur-md cursor-pointer shadow-sm hover:shadow-xl hover:border-[#f9c7d2]/25 transition-all duration-500 ease-out flex flex-col justify-end p-6 md:p-8`}
            style={{ '--mouse-x': '0px', '--mouse-y': '0px' } as React.CSSProperties}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={ACHIEVEMENTS_DATA[3].imagePath}
                alt={ACHIEVEMENTS_DATA[3].title}
                fill
                sizes="(max-w-768px) 100vw, 33vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out opacity-25 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/70 to-[#171513]/30 z-1" />
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-2"
                 style={{ background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(249, 199, 210, 0.08), transparent 80%)` }} />
            <div className="relative z-10 text-white flex flex-col justify-end h-full min-h-[160px] md:min-h-0 pointer-events-none">
              <div className="flex items-center gap-2 mb-3 bg-white/10 border border-white/5 w-fit px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-[#f9c7d2]">
                {getCategoryIcon(ACHIEVEMENTS_DATA[3].category)}
                <span>{ACHIEVEMENTS_DATA[3].category}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mb-1 group-hover:text-[#f9c7d2] transition-colors duration-300">
                {ACHIEVEMENTS_DATA[3].title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-white/70 font-medium mb-3">
                {ACHIEVEMENTS_DATA[3].subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-white/40 border-t border-white/5 pt-3 mt-1">
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[3].institution.split(',')[0]}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[3].date}</span>
              </div>
            </div>
          </div>

          {/* Card 5: Interactive Constellation Sandbox (Fills Row 2, Col 3) */}
          <ConstellationCard />

          {/* Card 6: Project Omnis Showcase */}
          <div
            ref={(el) => { cardsRef.current[4] = el; }}
            onMouseMove={(e) => handleMouseMove(e, 4)}
            onClick={() => setActiveItem(ACHIEVEMENTS_DATA[4])}
            className={`${ACHIEVEMENTS_DATA[4].gridClass} group relative rounded-2xl overflow-hidden border border-[#d3c2c5]/15 bg-[#171513]/85 backdrop-blur-md cursor-pointer shadow-sm hover:shadow-xl hover:border-[#f9c7d2]/25 transition-all duration-500 ease-out flex flex-col justify-end p-6 md:p-8`}
            style={{ '--mouse-x': '0px', '--mouse-y': '0px' } as React.CSSProperties}
          >
            <div className="absolute inset-0 z-0">
              <Image
                src={ACHIEVEMENTS_DATA[4].imagePath}
                alt={ACHIEVEMENTS_DATA[4].title}
                fill
                sizes="(max-w-768px) 100vw, 66vw"
                className="object-cover object-center group-hover:scale-102 transition-transform duration-700 ease-out opacity-25 group-hover:opacity-40"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#171513] via-[#171513]/70 to-[#171513]/30 z-1" />
            </div>
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-2"
                 style={{ background: `radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(249, 199, 210, 0.08), transparent 80%)` }} />
            <div className="relative z-10 text-white flex flex-col justify-end h-full min-h-[160px] md:min-h-0 pointer-events-none">
              <div className="flex items-center gap-2 mb-3 bg-white/10 border border-white/5 w-fit px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase text-[#f9c7d2]">
                {getCategoryIcon(ACHIEVEMENTS_DATA[4].category)}
                <span>{ACHIEVEMENTS_DATA[4].category}</span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold tracking-tight mb-1 group-hover:text-[#f9c7d2] transition-colors duration-300">
                {ACHIEVEMENTS_DATA[4].title}
              </h3>
              <p className="font-sans text-xs sm:text-sm text-white/70 font-medium mb-3">
                {ACHIEVEMENTS_DATA[4].subtitle}
              </p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-mono text-white/40 border-t border-white/5 pt-3 mt-1">
                <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[4].institution.split(',')[0]}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{ACHIEVEMENTS_DATA[4].date}</span>
              </div>
            </div>
          </div>

          {/* Card 7: Retro dev console logs terminal (Fills Row 3, Col 3) */}
          <TerminalCard />
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 md:p-8 animate-fade-in"
          onClick={() => setActiveItem(null)}
        >
          <div 
            className="relative w-full max-w-5xl bg-[#171513] text-[#FAF6EE] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh] animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
              onClick={() => setActiveItem(null)}
              className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-[#FAF6EE] hover:text-[#f9c7d2] p-2.5 rounded-full border border-white/10 transition-all cursor-pointer backdrop-blur-sm"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Section */}
            <div className="relative w-full md:w-3/5 h-[40vh] md:h-auto bg-black flex items-center justify-center border-b md:border-b-0 md:border-r border-white/5">
              <Image
                src={activeItem.imagePath}
                alt={activeItem.title}
                fill
                priority
                sizes="(max-w-1024px) 100vw, 60vw"
                className="object-contain p-2 md:p-4"
              />
            </div>

            {/* Modal Info Section */}
            <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col justify-between overflow-y-auto max-h-[50vh] md:max-h-none">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-4 bg-white/10 border border-white/5 w-fit px-3 py-1 rounded-full text-xs font-mono tracking-wider uppercase text-[#f9c7d2]">
                  {getCategoryIcon(activeItem.category)}
                  <span>{activeItem.category}</span>
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-extrabold tracking-tight mb-2 text-white leading-snug">
                  {activeItem.title}
                </h3>
                
                <p className="font-sans text-sm sm:text-base text-[#f9c7d2] font-semibold mb-6">
                  {activeItem.subtitle}
                </p>

                <div className="space-y-3 mb-6 bg-white/[0.03] p-4 rounded-xl border border-white/5 font-sans">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 text-white/50 mt-1" />
                    <div>
                      <span className="block text-[11px] uppercase tracking-widest font-mono text-white/40">Institution</span>
                      <span className="text-sm font-medium text-white/90">{activeItem.institution}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 text-white/50 mt-1" />
                    <div>
                      <span className="block text-[11px] uppercase tracking-widest font-mono text-white/40">Date Completed</span>
                      <span className="text-sm font-medium text-white/90">{activeItem.date}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <span className="block text-[11px] uppercase tracking-widest font-mono text-white/40 mb-2">Description</span>
                  <p className="font-sans text-sm md:text-base text-white/70 font-light leading-relaxed">
                    {activeItem.details}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/30 font-mono select-none">
                <span>KUNAL • DEV PORTFOLIO</span>
                <span>SECURED CREDENTIAL</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Animations Styling */}
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
      `}</style>
    </section>
  );
}
