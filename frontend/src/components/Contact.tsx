'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  MapPin, 
  Send, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Terminal,
  Cpu
} from 'lucide-react';
import { Github, Linkedin } from './Icons';

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

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import API from '../utils/api';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Refs for animations
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const formCardRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLSpanElement>(null);
  const successTitleRef = useRef<HTMLHeadingElement>(null);

  // Magnetic references
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const socialRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // 1. Interactive Canvas Particle System
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    const numParticles = Math.min(Math.floor((width * height) / 15000), 80);
    const mouse = { x: -1000, y: -1000, active: false };

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.2
      });
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary collisions
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 199, 210, ${p.alpha})`; // Rose color
        ctx.fill();
      });

      // Draw connection lines
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p1.x - p2.x, p1.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(211, 194, 197, ${0.15 * (1 - dist / 100)})`; // outline-variant
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }

        // Draw line to mouse
        if (mouse.active) {
          const mDist = Math.hypot(p1.x - mouse.x, p1.y - mouse.y);
          if (mDist < 150) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(249, 199, 210, ${0.35 * (1 - mDist / 150)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // 2. Entrance & Scroll Trigger Animations
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-title-anim',
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1.0, 
          ease: 'power4.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo('.contact-card-anim',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 65%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  // 3. Cyber Scramble Text Effect on Title
  useEffect(() => {
    const titleSpan = titleTextRef.current;
    if (!titleSpan) return;

    const originalText = titleSpan.innerText;
    let isScrambling = false;

    const triggerScramble = () => {
      if (isScrambling) return;
      isScrambling = true;
      const chars = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789@#$&*[]/+%';
      let iterations = 0;

      const interval = setInterval(() => {
        titleSpan.innerText = originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) return originalText[index];
            if (char === ' ') return ' ';
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');

        if (iterations >= originalText.length) {
          clearInterval(interval);
          isScrambling = false;
        }
        iterations += 1 / 2;
      }, 25);
    };

    // Scramble on hover
    titleSpan.addEventListener('mouseenter', triggerScramble);

    // Initial scramble delay after page load / scroll trigger
    const scrollHandler = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top 60%',
      onEnter: () => {
        setTimeout(triggerScramble, 400);
        scrollHandler.kill();
      }
    });

    return () => {
      titleSpan.removeEventListener('mouseenter', triggerScramble);
      scrollHandler.kill();
    };
  }, []);

  // 4. Smooth Magnetic Effect Hook
  useEffect(() => {
    const handleMagnetic = (element: HTMLElement, intensity = 0.3) => {
      const onMouseMove = (e: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(element, {
          x: x * intensity,
          y: y * intensity,
          duration: 0.3,
          ease: 'power2.out'
        });
      };

      const onMouseLeave = () => {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)'
        });
      };

      element.addEventListener('mousemove', onMouseMove);
      element.addEventListener('mouseleave', onMouseLeave);

      return () => {
        element.removeEventListener('mousemove', onMouseMove);
        element.removeEventListener('mouseleave', onMouseLeave);
      };
    };

    const cleanupFns: (() => void)[] = [];

    if (submitButtonRef.current) {
      cleanupFns.push(handleMagnetic(submitButtonRef.current, 0.2));
    }

    socialRefs.current.forEach((ref) => {
      if (ref) cleanupFns.push(handleMagnetic(ref, 0.35));
    });

    return () => cleanupFns.forEach(fn => fn());
  }, [submitted]);

  // 5. 3D Tilt Effect on Cards
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const rotateY = ((x - xc) / xc) * 8; // Max 8 degrees tilt
    const rotateX = -((y - yc) / yc) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    card.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
  };

  const handleCardMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.transition = 'transform 0.1s ease-out';
  };

  // Copy email utility
  const handleCopyEmail = () => {
    const email = 'skunalkumar759@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Required parameters missing. Transmission aborted.');
      return;
    }

    setSubmitting(true);

    try {
      const response = await API.post('/messages', formData);
      if (response.status === 201 || response.status === 200) {
        setSubmitted(true);
        // Animate scramble on success header
        setTimeout(() => {
          const successTitle = successTitleRef.current;
          if (successTitle) {
            const originalVal = successTitle.innerText;
            let iter = 0;
            const interval = setInterval(() => {
              successTitle.innerText = originalVal.split('').map((char, index) => {
                if (index < iter) return originalVal[index];
                if (char === ' ') return ' ';
                return '01'[Math.floor(Math.random() * 2)];
              }).join('');
              if (iter >= originalVal.length) clearInterval(interval);
              iter += 1/2;
            }, 30);
          }
        }, 100);
      } else {
        setErrorMsg('Node server rejected payload package.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.response?.data?.message || 'Transmission failed. Connection refused.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setFormData({ name: '', email: '', subject: '', message: '' });
    setSubmitted(false);
    setErrorMsg(null);
  };

  return (
    <section 
      ref={sectionRef}
      id="contact" 
      className="relative w-full bg-[#0c0a09] text-[#FAF6EE] py-24 md:py-32 border-t border-[#d3c2c5]/10 overflow-hidden select-none isolate"
    >
      {/* Interactive Particle Network Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-55"
      />

      {/* Grid Pattern overlay for depth texture */}
      <div className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#FAF6EE_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none z-0" />

      {/* Radial glow background blobs */}
      <div className="absolute top-1/3 left-1/4 w-[40vw] h-[40vw] rounded-full bg-[#7a545d] filter blur-[150px] opacity-10 pointer-events-none z-0" />
      <div className="absolute bottom-1/3 right-1/4 w-[40vw] h-[40vw] rounded-full bg-[#49654d] filter blur-[150px] opacity-10 pointer-events-none z-0" />

      <div className="relative max-w-7xl mx-auto px-8 md:px-16 lg:px-24 z-10">
        
        {/* Header Block */}
        <div className="contact-title-anim text-center md:text-left mb-16 md:mb-24 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#f9c7d2]/20 bg-white/5 text-[10px] font-mono font-bold tracking-widest text-[#f9c7d2] uppercase mb-6">
            <Cpu size={10} className="animate-pulse text-[#f9c7d2]" />
            TRANS-PORTAL ESTABLISHED
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-sans font-black tracking-tight uppercase leading-[0.95] text-white">
            Let's design <br />
            <span 
              ref={titleTextRef}
              className="text-[#f9c7d2] cursor-pointer inline-block font-sans font-black relative group"
            >
              something new
            </span>
          </h2>
        </div>

        {/* Content Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Left Column: Details Cards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Info Card: Direct Email */}
            <div 
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onMouseEnter={handleCardMouseEnter}
              className="glassy-spotlight-card rounded-2xl p-6 md:p-8 flex flex-col justify-between group transition-shadow duration-300 contact-card-anim border-white/[0.08]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-[#f9c7d2] group-hover:scale-110 transition-transform duration-300">
                  <Mail size={22} />
                </div>
                <button
                  onClick={handleCopyEmail}
                  className="p-2 bg-white/5 rounded-lg border border-white/10 hover:bg-[#f9c7d2] hover:text-[#1d1b18] text-white/60 transition-all cursor-pointer relative"
                  title="Copy email to clipboard"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied && (
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#49654d] text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
              <div>
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Direct Communication</span>
                <h4 className="text-xl font-bold font-sans text-white mb-2 group-hover:text-[#f9c7d2] transition-colors">Email Me</h4>
                <a 
                  href="mailto:skunalkumar759@gmail.com" 
                  className="text-lg font-medium text-[#f4ccab] hover:text-white transition-colors break-words font-mono"
                >
                  skunalkumar759@gmail.com
                </a>
              </div>
            </div>

            {/* Info Card: Location */}
            <div 
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onMouseEnter={handleCardMouseEnter}
              className="glassy-spotlight-card rounded-2xl p-6 md:p-8 flex flex-col justify-between group transition-shadow duration-300 contact-card-anim border-white/[0.08]"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3.5 bg-white/5 rounded-xl border border-white/10 text-[#caebcc] group-hover:scale-110 transition-transform duration-300">
                  <MapPin size={22} />
                </div>
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-white/50">
                  UTC+5:30
                </span>
              </div>
              <div>
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-1">Location Coordinates</span>
                <h4 className="text-xl font-bold font-sans text-white mb-1 group-hover:text-[#caebcc] transition-colors">Jamshedpur, Jharkhand</h4>
                <p className="text-sm text-white/60 font-light leading-relaxed">
                  Open to remote work worldwide and relocations.
                </p>
              </div>
            </div>

            {/* Info Card: Digital Presence */}
            <div 
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onMouseEnter={handleCardMouseEnter}
              className="glassy-spotlight-card rounded-2xl p-6 md:p-8 flex flex-col justify-between group transition-shadow duration-300 contact-card-anim border-white/[0.08]"
            >
              <div>
                <span className="text-xs font-mono text-white/40 uppercase tracking-widest block mb-4">Connect Digitally</span>
                <h4 className="text-xl font-bold font-sans text-white mb-4 group-hover:text-[#f4ccab] transition-colors">Social Hub</h4>
                <div className="flex flex-wrap gap-4">
                  
                  {/* GitHub */}
                  <a 
                    ref={el => { socialRefs.current[0] = el; }}
                    href="https://github.com/kunalSingh026" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3.5 bg-white/5 hover:bg-[#FAF6EE] text-white hover:text-[#1d1b18] rounded-xl border border-white/10 transition-colors cursor-pointer"
                    title="GitHub Profile"
                  >
                    <Github size={20} />
                  </a>

                  {/* LinkedIn */}
                  <a 
                    ref={el => { socialRefs.current[1] = el; }}
                    href="https://www.linkedin.com/in/s-kunal-kumar-singh-7662ad" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3.5 bg-white/5 hover:bg-[#FAF6EE] text-white hover:text-[#1d1b18] rounded-xl border border-white/10 transition-colors cursor-pointer"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={20} />
                  </a>

                  {/* Instagram */}
                  <a 
                    ref={el => { socialRefs.current[2] = el; }}
                    href="https://www.instagram.com/kunal__3207/?__pwa=1" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-3.5 bg-white/5 hover:bg-[#FAF6EE] text-white hover:text-[#1d1b18] rounded-xl border border-white/10 transition-colors cursor-pointer"
                    title="Instagram Profile"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            
            <div 
              ref={formCardRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              onMouseEnter={handleCardMouseEnter}
              className="glassy-spotlight-card rounded-3xl p-8 md:p-10 w-full relative overflow-hidden border-white/[0.08]"
            >
              {/* Card Window Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-8">
                <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-white/40 font-mono">
                  <Terminal size={12} /> secure_tunnel.sh
                </div>
              </div>

              {!submitted ? (
                /* Form Screen */
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Row: Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Input: Name */}
                    <div className="relative w-full group/input">
                      {/* Custom Input Glow Overlay */}
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#f9c7d2] to-[#7a545d] rounded-xl blur opacity-0 group-hover/input:opacity-10 transition duration-300 ${
                        focusedField === 'name' ? 'opacity-20!' : ''
                      }`} />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-[#171513] border rounded-xl px-4 pt-6 pb-2 text-white font-sans text-sm outline-none transition-all duration-300 relative z-10 ${
                          focusedField === 'name' ? 'border-[#f9c7d2]' : 'border-white/10'
                        }`}
                        required
                        id="form-name"
                      />
                      <label 
                        htmlFor="form-name"
                        className={`absolute left-4 pointer-events-none transition-all duration-300 font-sans z-20 ${
                          focusedField === 'name' || formData.name 
                            ? 'top-2 text-[9px] font-bold text-[#f9c7d2] tracking-wider uppercase' 
                            : 'top-1/2 -translate-y-1/2 text-sm text-white/40'
                        }`}
                      >
                        Your Name *
                      </label>
                      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[#f9c7d2] to-[#7a545d] transition-all duration-300 z-20 ${
                        focusedField === 'name' ? 'w-full' : 'w-0'
                      }`} />
                    </div>

                    {/* Input: Email */}
                    <div className="relative w-full group/input">
                      <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#f9c7d2] to-[#7a545d] rounded-xl blur opacity-0 group-hover/input:opacity-10 transition duration-300 ${
                        focusedField === 'email' ? 'opacity-20!' : ''
                      }`} />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        className={`w-full bg-[#171513] border rounded-xl px-4 pt-6 pb-2 text-white font-sans text-sm outline-none transition-all duration-300 relative z-10 ${
                          focusedField === 'email' ? 'border-[#f9c7d2]' : 'border-white/10'
                        }`}
                        required
                        id="form-email"
                      />
                      <label 
                        htmlFor="form-email"
                        className={`absolute left-4 pointer-events-none transition-all duration-300 font-sans z-20 ${
                          focusedField === 'email' || formData.email 
                            ? 'top-2 text-[9px] font-bold text-[#f9c7d2] tracking-wider uppercase' 
                            : 'top-1/2 -translate-y-1/2 text-sm text-white/40'
                        }`}
                      >
                        Email Address *
                      </label>
                      <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[#f9c7d2] to-[#7a545d] transition-all duration-300 z-20 ${
                        focusedField === 'email' ? 'w-full' : 'w-0'
                      }`} />
                    </div>

                  </div>

                  {/* Input: Subject */}
                  <div className="relative w-full group/input">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#f9c7d2] to-[#7a545d] rounded-xl blur opacity-0 group-hover/input:opacity-10 transition duration-300 ${
                      focusedField === 'subject' ? 'opacity-20!' : ''
                    }`} />
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({...formData, subject: e.target.value})}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full bg-[#171513] border rounded-xl px-4 pt-6 pb-2 text-white font-sans text-sm outline-none transition-all duration-300 relative z-10 ${
                        focusedField === 'subject' ? 'border-[#f9c7d2]' : 'border-white/10'
                      }`}
                      id="form-subject"
                    />
                    <label 
                      htmlFor="form-subject"
                      className={`absolute left-4 pointer-events-none transition-all duration-300 font-sans z-20 ${
                        focusedField === 'subject' || formData.subject 
                          ? 'top-2 text-[9px] font-bold text-[#f9c7d2] tracking-wider uppercase' 
                          : 'top-1/2 -translate-y-1/2 text-sm text-white/40'
                      }`}
                    >
                      Subject Topic
                    </label>
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[#f9c7d2] to-[#7a545d] transition-all duration-300 z-20 ${
                      focusedField === 'subject' ? 'w-full' : 'w-0'
                    }`} />
                  </div>

                  {/* Input: Message Body */}
                  <div className="relative w-full group/input">
                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-[#f9c7d2] to-[#7a545d] rounded-xl blur opacity-0 group-hover/input:opacity-10 transition duration-300 ${
                      focusedField === 'message' ? 'opacity-20!' : ''
                    }`} />
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      rows={5}
                      className={`w-full bg-[#171513] border rounded-xl px-4 pt-6 pb-2 text-white font-sans text-sm outline-none resize-none transition-all duration-300 relative z-10 ${
                        focusedField === 'message' ? 'border-[#f9c7d2]' : 'border-white/10'
                      }`}
                      required
                      id="form-message"
                    />
                    <label 
                      htmlFor="form-message"
                      className={`absolute left-4 pointer-events-none transition-all duration-300 font-sans z-20 ${
                        focusedField === 'message' || formData.message 
                          ? 'top-2 text-[9px] font-bold text-[#f9c7d2] tracking-wider uppercase' 
                          : 'top-4 text-sm text-white/40'
                      }`}
                    >
                      Message Payload *
                    </label>
                    <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-[#f9c7d2] to-[#7a545d] transition-all duration-300 z-20 ${
                      focusedField === 'message' ? 'w-full' : 'w-0'
                    }`} />
                  </div>

                  {/* Display Error Message */}
                  {errorMsg && (
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-300 text-xs font-mono flex items-center gap-2.5 animate-shake">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                      {errorMsg}
                    </div>
                  )}

                  {/* Action Row */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="text-[10px] font-mono text-white/30">
                      * Required data packets
                    </div>
                    <button
                      ref={submitButtonRef}
                      type="submit"
                      disabled={submitting}
                      className="px-8 py-4.5 bg-[#FFD000] text-[#1d1b18] font-sans font-bold text-sm uppercase tracking-wider border border-[#1d1b18] shadow-[4px_4px_0px_0px_rgba(255,255,255,0.08)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.02)] transition-all duration-100 flex items-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed z-20"
                    >
                      {submitting ? (
                        <>
                          TRANSMITTING
                          <span className="flex gap-1">
                            <span className="w-1.5 h-1.5 bg-[#1d1b18] rounded-full animate-bounce" />
                            <span className="w-1.5 h-1.5 bg-[#1d1b18] rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="w-1.5 h-1.5 bg-[#1d1b18] rounded-full animate-bounce [animation-delay:0.4s]" />
                          </span>
                        </>
                      ) : (
                        <>
                          TRANSMIT PAYLOAD
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              ) : (
                /* Success Screen */
                <div className="text-center py-12 px-4 space-y-6 flex flex-col items-center">
                  
                  {/* Glowing success hub */}
                  <div className="relative w-28 h-28 flex items-center justify-center animate-bounce">
                    {/* Glowing Success Ring */}
                    <div className="absolute inset-0 bg-[#caebcc]/5 border border-[#caebcc]/20 rounded-full scale-100 animate-pulse filter blur-md" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full border border-dashed border-[#caebcc]/30 animate-spin-slow" />
                    <div className="relative z-10 p-5 bg-[#caebcc]/10 border border-[#caebcc]/20 rounded-full text-[#caebcc]">
                      <Check size={36} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 
                      ref={successTitleRef}
                      className="text-2xl sm:text-3xl font-sans font-black tracking-tight text-white uppercase font-mono"
                    >
                      MESSAGE TRANSMITTED
                    </h3>
                    <p className="text-sm font-light text-white/70 max-w-md mx-auto leading-relaxed">
                      Handshake complete, <span className="text-[#f9c7d2] font-semibold">{formData.name}</span>. The packet has been successfully logged and routed to my stack. I'll get back to you shortly.
                    </p>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={handleResetForm}
                      className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-mono font-bold tracking-wider uppercase flex items-center gap-2 cursor-pointer transition-all mx-auto"
                    >
                      RESET TRANS-TUNNEL
                      <ArrowRight size={12} />
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}