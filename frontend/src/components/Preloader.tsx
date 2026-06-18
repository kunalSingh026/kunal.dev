'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete?: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const pathLength = path.getTotalLength();
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          setIsDone(true);
          if (onComplete) onComplete();
        }
      });

      const counterObj = { value: 0 };
      tl.to(counterObj, {
        value: 100,
        duration: 1.6,
        ease: 'power2.out',
        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = Math.floor(counterObj.value).toString().padStart(3, '0');
          }
        }
      });

      tl.fromTo(textRef.current, 
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
        '-=1.2'
      );

      tl.to(path, {
        strokeDashoffset: 0,
        duration: 0.7,
        ease: 'power2.inOut'
      }, '-=0.4');

      tl.to({}, { duration: 0.3 });

      tl.to(containerRef.current, {
        yPercent: -100,
        duration: 1.0,
        ease: 'power4.inOut',
      });
    }, containerRef);

    return () => ctx.revert();
  }, [onComplete]);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full bg-white flex flex-col items-center justify-between py-16 z-[9999]"
      style={{ touchAction: 'none' }}
    >
      <div />
      <div className="relative flex items-center justify-center w-full max-w-2xl px-6 h-48">
        <h1 
          ref={textRef}
          className="text-black font-black text-5xl sm:text-6xl md:text-7xl tracking-wider font-sans text-center select-none"
          style={{ opacity: 0 }}
        >
          KUNAL<span className="text-[#FF5A36] px-1">•</span>DEV
        </h1>

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 600 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            ref={pathRef}
            d="M 100,115 Q 240,90 285,85 C 310,80 305,105 315,100 Q 390,75 500,55"
            stroke="#FF5A36"
            strokeWidth="8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div ref={counterRef} className="text-black/40 font-mono text-base md:text-lg font-bold tracking-widest">
        000
      </div>
    </div>
  );
}