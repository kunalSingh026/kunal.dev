'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Project {
  id: number;
  title: string;
  tag: string;
  description: string;
  imagePath: string;
  githubUrl: string;
  liveUrl: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: 1,
    title: 'HACKFLOW',
    tag: 'Full-Stack & Security',
    description: 'Full-stack platform for hosting and managing hackathons.',
    imagePath: '/projects/hackflow.png',
    githubUrl: 'https://github.com/kunalSingh026/HackFlow.git',
    liveUrl: 'https://hack-flow-rust.vercel.app/',
  },
  {
    id: 2,
    title: 'CINEBOOK',
    tag: 'React & Database',
    description: 'A complete movie ticket booking platform featuring interactive seat grid reservations, transaction locking, and session checkouts.',
    imagePath: '/projects/cinebook.png',
    githubUrl: 'https://github.com/kunalSingh026/CineBook.git',
    liveUrl: 'https://cinebook.kunal.dev',
  },
  {
    id: 3,
    title: 'ATTENDANCE TRACKER',
    tag: 'Django & Campus',
    description: 'Automated Django platform optimizing campus tracking.',
    imagePath: '/projects/attendance_tracker.png',
    githubUrl: 'https://github.com/kunalSingh026/Attendance-Tarcker.git',
    liveUrl: 'https://attendance-tarcker.onrender.com',
  },
  {
    id: 4,
    title: 'AUTHENTICATION SYSTEM',
    tag: 'Identity & Security',
    description: 'A secure authentication microservice featuring JWT tokens, MFA, session management, and OAuth2 integration.',
    imagePath: '/projects/authentication_system.png',
    githubUrl: 'https://github.com/kunalSingh026/Authentication_System.git',
    liveUrl: 'https://auth.kunal.dev',
  },
  {
    id: 5,
    title: 'FLEETEASE',
    tag: 'Java & Console',
    description: 'Object-oriented Java console application for vehicle rentals.',
    imagePath: '/projects/fleetease.png',
    githubUrl: 'https://github.com/kunalSingh026/Fleetease.git',
    liveUrl: 'https://fleetease.kunal.dev',
  }
];

export default function Projects() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const mouseRef = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const updateArc = () => {
    const container = scrollAreaRef.current;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const centerX = containerRect.width / 2;

    itemsRef.current.forEach((item) => {
      if (!item) return;
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distanceToCenter = itemCenter - centerX;

      // Normalizing distance relative to container width (-1 to 1)
      const normalizedDist = distanceToCenter / (containerRect.width / 1.5);

      // Parabolic vertical drop along the arc
      const translateY = Math.pow(Math.abs(normalizedDist), 2) * 140;
      const rotateZ = normalizedDist * 12; // tilt following the curve
      const scale = Math.max(0.78, 1 - Math.abs(normalizedDist) * 0.16);
      const opacity = Math.max(0.25, 1 - Math.abs(normalizedDist) * 0.55);

      const card = item.querySelector('.project-card') as HTMLDivElement;
      if (card) {
        card.style.transform = `translateY(${translateY}px) rotate(${rotateZ}deg) scale(${scale})`;
        card.style.opacity = `${opacity}`;
      }
    });
  };

  useEffect(() => {
    if (!mounted) return;
    const container = scrollAreaRef.current;
    if (!container) return;

    updateArc();
    container.addEventListener('scroll', updateArc);
    window.addEventListener('resize', updateArc);

    const timer = setTimeout(updateArc, 100);

    return () => {
      container.removeEventListener('scroll', updateArc);
      window.removeEventListener('resize', updateArc);
      clearTimeout(timer);
    };
  }, [mounted]);

  // Background Interactive Canvas Logic
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Physics & Rendering Constants
    const spacing = 45;
    const dotRadius = 1.5;
    const radius = 220;
    const maxDisplacement = 50;
    const springK = 0.08;
    const damping = 0.88;
    const baseDotOpacity = 0.1;
    const baseLineOpacity = 0.03;
    const activeGlowOpacity = 0.12;
    const glowRadius = 220;

    interface Dot {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
    }

    let dots: Dot[][] = [];
    let animationFrameId: number;

    const initGrid = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;

      const cols = Math.ceil(rect.width / spacing) + 1;
      const rows = Math.ceil(rect.height / spacing) + 1;

      dots = [];
      for (let r = 0; r < rows; r++) {
        const row: Dot[] = [];
        for (let c = 0; c < cols; c++) {
          const baseX = c * spacing;
          const baseY = r * spacing;
          row.push({
            x: baseX,
            y: baseY,
            baseX,
            baseY,
            vx: 0,
            vy: 0,
          });
        }
        dots.push(row);
      }
    };

    initGrid();

    // Helper to interpolate node/line color based on proximity to the curved top mask boundary
    const getInterpolatedColor = (x: number, y: number, baseOpacity: number) => {
      const centerX = canvas.width / 2;
      const centerY = -0.4 * canvas.width;
      const maskRadius = 0.8 * canvas.width;

      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const transitionWidth = 40; // 40px smooth blend zone
      const diff = dist - maskRadius;

      // t goes from 0 (deep inside white mask) to 1 (deep outside in dark bg)
      let t = (diff + transitionWidth) / (2 * transitionWidth);
      t = Math.max(0, Math.min(1, t));

      // Inside: Dark Charcoal #1d1b18 (29, 27, 24)
      // Outside: Cream #FAF6EE (250, 246, 238)
      const r = Math.round(29 + (250 - 29) * t);
      const g = Math.round(27 + (246 - 27) * t);
      const b = Math.round(24 + (238 - 24) * t);

      // Boost opacity slightly inside the mask since dark nodes on cream can be harder to see if too faint
      const op = baseOpacity * (1.6 - 0.6 * t);

      return `rgba(${r}, ${g}, ${b}, ${op})`;
    };

    // Helper to interpolate cursor spotlight color based on cursor position
    const getSpotlightColor = (mx: number, my: number) => {
      const centerX = canvas.width / 2;
      const centerY = -0.4 * canvas.width;
      const maskRadius = 0.8 * canvas.width;

      const dx = mx - centerX;
      const dy = my - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const transitionWidth = 50;
      const diff = dist - maskRadius;
      let t = (diff + transitionWidth) / (2 * transitionWidth);
      t = Math.max(0, Math.min(1, t));

      // Inside: Theme Purple/Pink #7a545d (122, 84, 93) with opacity 0.05
      // Outside: Theme Gold #FFD000 (255, 199, 0) with opacity 0.04
      const r = Math.round(122 + (255 - 122) * t);
      const g = Math.round(84 + (199 - 84) * t);
      const b = Math.round(93 + (0 - 93) * t);
      const op = 0.05 - 0.01 * t;

      return `rgba(${r}, ${g}, ${b}, ${op})`;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouse = mouseRef.current;
      const rows = dots.length;
      const cols = rows > 0 ? dots[0].length : 0;

      // 1. Update Physics
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dot = dots[r][c];
          let targetX = dot.baseX;
          let targetY = dot.baseY;

          if (mouse.x !== null && mouse.y !== null) {
            const dx = dot.baseX - mouse.x;
            const dy = dot.baseY - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < radius) {
              const force = (radius - dist) / radius;
              const displacement = Math.pow(force, 1.5) * maxDisplacement;
              const angle = Math.atan2(dy, dx);
              targetX = dot.baseX + Math.cos(angle) * displacement;
              targetY = dot.baseY + Math.sin(angle) * displacement;
            }
          }

          const ax = (targetX - dot.x) * springK;
          const ay = (targetY - dot.y) * springK;
          dot.vx = (dot.vx + ax) * damping;
          dot.vy = (dot.vy + ay) * damping;
          dot.x += dot.vx;
          dot.y += dot.vy;
        }
      }

      // 2. Draw Grid Lines
      ctx.lineWidth = 0.75;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dot = dots[r][c];

          // Draw horizontal connection
          if (c < cols - 1) {
            const rightDot = dots[r][c + 1];
            let opacity = baseLineOpacity;
            if (mouse.x !== null && mouse.y !== null) {
              const avgX = (dot.x + rightDot.x) / 2;
              const avgY = (dot.y + rightDot.y) / 2;
              const mdx = avgX - mouse.x;
              const mdy = avgY - mouse.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mdist < glowRadius) {
                opacity += (1 - mdist / glowRadius) * activeGlowOpacity;
              }
            }
            ctx.strokeStyle = getInterpolatedColor((dot.x + rightDot.x) / 2, (dot.y + rightDot.y) / 2, opacity);
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(rightDot.x, rightDot.y);
            ctx.stroke();
          }

          // Draw vertical connection
          if (r < rows - 1) {
            const bottomDot = dots[r + 1][c];
            let opacity = baseLineOpacity;
            if (mouse.x !== null && mouse.y !== null) {
              const avgX = (dot.x + bottomDot.x) / 2;
              const avgY = (dot.y + bottomDot.y) / 2;
              const mdx = avgX - mouse.x;
              const mdy = avgY - mouse.y;
              const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
              if (mdist < glowRadius) {
                opacity += (1 - mdist / glowRadius) * activeGlowOpacity;
              }
            }
            ctx.strokeStyle = getInterpolatedColor((dot.x + bottomDot.x) / 2, (dot.y + bottomDot.y) / 2, opacity);
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(bottomDot.x, bottomDot.y);
            ctx.stroke();
          }
        }
      }

      // 3. Draw Grid Nodes (Dots)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const dot = dots[r][c];
          let opacity = baseDotOpacity;
          if (mouse.x !== null && mouse.y !== null) {
            const mdx = dot.x - mouse.x;
            const mdy = dot.y - mouse.y;
            const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mdist < glowRadius) {
              opacity += (1 - mdist / glowRadius) * (activeGlowOpacity * 2.5);
            }
          }
          ctx.fillStyle = getInterpolatedColor(dot.x, dot.y, opacity);
          ctx.beginPath();
          ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Draw Cursor Spotlight Highlight
      if (mouse.x !== null && mouse.y !== null) {
        const grad = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, glowRadius
        );
        const spotColorBase = getSpotlightColor(mouse.x, mouse.y);
        const spotColorTransparent = spotColorBase.replace(/[\d\.]+\)$/, '0)');
        
        grad.addColorStop(0, spotColorBase);
        grad.addColorStop(1, spotColorTransparent);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Event Handlers for Mouse/Touch relative tracking
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

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    // Resize Handler
    let resizeTimer: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        initGrid();
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimer);
    };
  }, [mounted]);

  // Card cursor spotlight move listener
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--x', `${x}px`);
    card.style.setProperty('--y', `${y}px`);
  };

  return (
    <section 
      ref={containerRef}
      className="bg-[#1d1b18] text-[#FAF6EE] min-h-screen py-36 relative overflow-hidden flex flex-col justify-center" 
      id="projects"
    >
      {/* Grid Warp Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-2" 
      />

      {/* Signature Curved Top Divider Mask */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160%] aspect-square rounded-full bg-[#FAF6EE] -translate-y-3/4 z-1 pointer-events-none" />

      {/* Header Info */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 lg:px-24 mb-12 select-none w-full">
        <span className="font-mono text-xs text-[#7a545d] uppercase tracking-widest block mb-4">
          Architecting Digital Deployments
        </span>
        <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#1d1b18]">
          FEATURED PROJECTS
        </h2>
        <div className="w-12 h-1 bg-[#7a545d] mt-6 rounded-full" />
      </div>

      {/* Arc Carousel Container */}
      <div 
        ref={scrollAreaRef}
        className="arc-container no-scrollbar flex items-center h-[540px] overflow-x-auto relative px-[25vw] snap-x snap-mandatory z-10 pointer-events-auto"
      >
        {/* Spacer for scroll snap centering */}
        <div className="shrink-0 w-[15vw] md:w-[20vw]" />

        {PROJECTS_DATA.map((project, idx) => (
          <div 
            key={project.id}
            ref={(el) => { itemsRef.current[idx] = el; }}
            className="project-item snap-center shrink-0 w-[80vw] md:w-[500px] mx-6 relative"
          >
            {/* Spotlight Card wrapper */}
            <div 
              onMouseMove={handleCardMouseMove}
              className="project-card rounded-2xl aspect-[4/5] md:aspect-video flex flex-col items-center justify-center p-8 overflow-hidden relative group"
            >
              {/* Project screenshot background layer */}
              <img 
                src={project.imagePath} 
                alt={project.title}
                className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-10 transition-opacity duration-500 z-0 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1d1b18]/70 z-1 pointer-events-none" />

              {/* Title & Tag layer - slides up on hover */}
              <div className="relative z-10 text-center transition-transform duration-500 group-hover:-translate-y-12 select-none">
                <span className="font-mono text-xs text-[#f9c7d2] uppercase tracking-widest mb-2 block">{project.tag}</span>
                <h3 className="font-serif text-3xl font-bold text-[#FAF6EE] tracking-wide">{project.title}</h3>
              </div>

              {/* Hover details and buttons - reveals on hover */}
              <div className="absolute inset-x-8 bottom-8 flex flex-col items-center justify-end opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-8 group-hover:translate-y-0 z-20 pointer-events-none">
                <p className="font-sans text-xs sm:text-sm text-[#FAF6EE]/80 text-center mb-6 max-w-xs leading-relaxed">
                  {project.description}
                </p>
                <div className="flex gap-4 w-full justify-center pointer-events-auto">
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="bg-[#FFD000] text-[#1d1b18] font-sans font-bold text-xs uppercase tracking-wider py-2.5 px-4 flex-1 text-center border border-[#1d1b18] shadow-[2px_2px_0px_0px_#1d1b18] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_#1d1b18] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1d1b18] transition-all duration-100"
                  >
                    Live Demo
                  </a>
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="border border-[#FAF6EE] text-[#FAF6EE] font-sans font-bold text-xs uppercase tracking-wider py-2.5 px-4 flex-1 text-center hover:bg-[#FAF6EE]/10 transition-colors"
                  >
                    Repository
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Spacer for scroll snap centering */}
        <div className="shrink-0 w-[15vw] md:w-[20vw]" />
      </div>

      {/* Swipe/Scroll assist overlay */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-30 select-none pointer-events-none">
        <span className="text-white text-xs font-mono tracking-widest uppercase animate-pulse">
          Swipe to Explore Projects →
        </span>
      </div>
    </section>
  );
}