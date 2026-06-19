'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface EducationItem {
  id: number;
  title: string;
  institution: string;
  gpa: string;
  details: string;
}

const EDUCATION_DATA: EducationItem[] = [
  {
    id: 1,
    title: 'Diploma — Computer Science Engineering',
    institution: 'Government Polytechnic, Kharsawan | 2021 — 2024',
    gpa: 'Final Cumulative GPA: 8.6 / 10',
    details: 'Focus Areas: Object-Oriented Programming, Database Management Systems (DBMS), Operating Systems, and Web Development Basics. Key Highlights: Built a strong foundational understanding of core computing principles and practical software troubleshooting. Developed hands-on mini-projects spanning desktop applications and web design.'
  },
  {
    id: 2,
    title: 'Bachelor of Technology — Computer Science & Engineering',
    institution: 'Netaji Subhas University | 2024 — 2027 (Expected)',
    gpa: 'Cumulative GPA: 8.8 / 10 (Current)',
    details: 'Focus Areas: Advanced Algorithms, Cloud Architecture, DevOps & CI/CD Pipelines, and Systems Engineering. Key Highlights: Specializing in containerized environments (Docker), orchestration, and deploying scalable microservices. Actively building robust full-stack applications with Django and Next.js.'
  }
];

export default function Education() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const digitContainerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Split details text into words for stagger animations
  const renderWords = (text: string, slideIdx: number) => {
    return text.split(' ').map((word, wordIdx) => (
      <span 
        key={wordIdx} 
        className={`word-slide-${slideIdx} inline-block mr-1.5 text-[#FAF6EE]/20 transition-colors duration-200 select-none`}
      >
        {word}
      </span>
    ));
  };

  // GSAP ScrollTrigger Pinning and Slide Animation
  useEffect(() => {
    if (!mounted) return;
    const section = sectionRef.current;
    const digitContainer = digitContainerRef.current;
    if (!section || !digitContainer) return;

    // Create the GSAP ScrollTrigger timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      }
    });

    // Setup initial slide states
    slidesRef.current.forEach((slide, idx) => {
      if (slide && idx > 0) {
        gsap.set(slide, { opacity: 0, y: 50 });
      }
    });

    // 1. Slide 1 Reveal
    tl.to('.word-slide-0', {
      color: '#FAF6EE',
      stagger: 0.03,
      duration: 1.5,
      ease: 'none'
    })
    
    // 2. Transition Slide 1 -> Slide 2
    .to(digitContainer, { yPercent: -50, duration: 1, ease: 'power2.inOut' }, '+=0.2')
    .to(slidesRef.current[0], { opacity: 0, y: -50, duration: 1, ease: 'power2.in' }, '<')
    .to(slidesRef.current[1], { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }, '<')
    
    // 3. Slide 2 Reveal
    .to('.word-slide-1', {
      color: '#FAF6EE',
      stagger: 0.03,
      duration: 1.5,
      ease: 'none'
    });

    return () => {
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
      tl.kill();
    };
  }, [mounted]);

  // Background Canvas Interactive Glowing Grid Logic
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const spacing = 50; // Grid square size in pixels
    const glowRadius = 240; // Proximity glow radius

    const initCanvas = () => {
      const rect = section.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    initCanvas();

    const drawGrid = (w: number, h: number) => {
      ctx.beginPath();
      // Draw vertical lines
      for (let x = 0; x < w; x += spacing) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      // Draw horizontal lines
      for (let y = 0; y < h; y += spacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
    };

    const animate = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // 1. Draw faint base background grid
      ctx.strokeStyle = 'rgba(250, 246, 238, 0.025)';
      ctx.lineWidth = 0.75;
      drawGrid(w, h);
      ctx.stroke();

      // 2. Draw glowing highlight grid near the cursor
      const mouse = mouseRef.current;
      if (mouse.x !== null && mouse.y !== null) {
        const grad = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, glowRadius
        );
        // Glow gradient: gold highlight matching Kunal's theme
        grad.addColorStop(0, 'rgba(255, 199, 0, 0.22)');
        grad.addColorStop(0.5, 'rgba(255, 199, 0, 0.08)');
        grad.addColorStop(1, 'rgba(255, 199, 0, 0)');

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.25;
        drawGrid(w, h);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
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

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
        };
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current = { x: null, y: null };
    };

    section.addEventListener('mousemove', handleMouseMove);
    section.addEventListener('mouseleave', handleMouseLeave);
    section.addEventListener('touchmove', handleTouchMove, { passive: true });
    section.addEventListener('touchend', handleTouchEnd);

    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initCanvas();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      section.removeEventListener('mousemove', handleMouseMove);
      section.removeEventListener('mouseleave', handleMouseLeave);
      section.removeEventListener('touchmove', handleTouchMove);
      section.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
    };
  }, [mounted]);

  return (
    <section 
      ref={sectionRef}
      className="relative min-h-screen w-full bg-[#1d1b18] text-[#FAF6EE] flex items-center overflow-hidden" 
      id="journey"
    >
      {/* Background Smoke Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      />

      {/* Floating Section Title */}
      <div className="absolute top-16 left-8 md:left-16 lg:left-24 z-10 select-none">
        <span className="font-mono text-xs text-[#f9c7d2] uppercase tracking-widest block mb-2">
          Academic Timeline & Milestones
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF6EE] uppercase">
          MY JOURNEY
        </h2>
        <div className="w-12 h-1 bg-[#f9c7d2] mt-4 rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-16 lg:px-24 py-28 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-20">
        
        {/* Left Column: Sliding Numbers */}
        <div className="flex-shrink-0 flex items-center justify-center font-serif text-[10rem] sm:text-[12rem] md:text-[14rem] lg:text-[16rem] font-black leading-none text-[#FAF6EE]/10 select-none md:w-1/3">
          <span>0</span>
          {/* Unit Digit viewport */}
          <div className="h-[1.1em] overflow-hidden relative w-[0.8em] flex items-center">
            <div 
              ref={digitContainerRef} 
              className="flex flex-col absolute left-0 top-0 w-full"
            >
              <span className="h-[1.1em] flex items-center justify-center">1</span>
              <span className="h-[1.1em] flex items-center justify-center">2</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sliding Content Card */}
        <div className="flex-grow relative min-h-[350px] md:min-h-[420px] w-full md:w-2/3 flex items-center">
          {EDUCATION_DATA.map((item, idx) => (
            <div
              key={item.id}
              ref={(el) => { slidesRef.current[idx] = el; }}
              className={`absolute inset-x-0 flex flex-col justify-center ${
                idx === 0 ? 'relative opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
              }`}
            >
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-[#FAF6EE] mb-3 leading-snug">
                {item.title}
              </h3>
              <h4 className="font-sans text-base sm:text-lg font-medium text-[#f9c7d2] tracking-wide mb-3">
                {item.institution}
              </h4>
              <h5 className="font-mono text-xs text-[#FAF6EE]/50 uppercase tracking-widest mb-6">
                {item.gpa}
              </h5>
              <p className="font-sans text-base sm:text-lg lg:text-xl font-light leading-relaxed text-[#FAF6EE]/20 max-w-2xl">
                {renderWords(item.details, idx)}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
