'use client';

import React, { useEffect, useRef, useState } from 'react';
import { 
  Code, 
  Layers, 
  Cloud,
  Wrench,
  Flame, 
  Award, 
  Sparkles, 
  Shield,
  Activity,
  Globe,
  ExternalLink,
  Laptop,
  Check
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Skill {
  name: string;
  level: string;
  tagline: string;
  statusBadge: string;
  color: string; // The hex color for custom glows
  progress: number;
  category: 'languages' | 'frameworks' | 'cloud' | 'tools';
}

const SKILLS_DATA: Skill[] = [
  // Languages
  { name: 'Python', level: 'Advanced', tagline: 'OOP Scripting & Backend Services', statusBadge: 'SCRIPTED', color: '#3776AB', progress: 95, category: 'languages' },
  { name: 'JavaScript', level: 'Advanced', tagline: 'Asynchronous Frontend & API Architectures', statusBadge: 'INTERPRETED', color: '#F7DF1E', progress: 92, category: 'languages' },
  { name: 'TypeScript', level: 'Intermediate', tagline: 'Typed Frontend & Full-Stack Security', statusBadge: 'COMPILED', color: '#3178C6', progress: 85, category: 'languages' },
  { name: 'C', level: 'Advanced', tagline: 'Memory Architecture & Low-Level Computations', statusBadge: 'STATIC-LOW', color: '#A8B9CC', progress: 90, category: 'languages' },
  { name: 'C++', level: 'Advanced', tagline: 'Data Structures, Algorithms & STL Mastery', statusBadge: 'STATIC-COMP', color: '#00599C', progress: 92, category: 'languages' },
  { name: 'Java', level: 'Advanced', tagline: 'Enterprise Application Frameworks & JVM Systems', statusBadge: 'JVM-COMP', color: '#F8981D', progress: 88, category: 'languages' },
  { name: 'SQL', level: 'Advanced', tagline: 'Relational Database Queries & Schema Designs', statusBadge: 'QUERY-READY', color: '#00758F', progress: 95, category: 'languages' },
  
  // Frameworks
  { name: 'Django', level: 'Advanced', tagline: 'Secure REST APIs & Backend Services', statusBadge: 'SECURED', color: '#092E20', progress: 95, category: 'frameworks' },
  { name: 'Node.js', level: 'Advanced', tagline: 'Scalable Microservices & System Workflows', statusBadge: 'RUNTIME', color: '#339933', progress: 90, category: 'frameworks' },
  { name: 'Express.js', level: 'Advanced', tagline: 'Lightweight Server-Side Endpoints & Routing', statusBadge: 'ROUTED', color: '#888888', progress: 92, category: 'frameworks' },
  
  // DevOps & Deployment
  { name: 'Docker', level: 'Advanced', tagline: 'Containerized Architectures & Multi-Stage builds', statusBadge: 'ISOLATED', color: '#2496ED', progress: 95, category: 'cloud' },
  { name: 'Git/GitHub', level: 'Advanced', tagline: 'Version Control, Collaborative Flows & Git Hooks', statusBadge: 'MERGED', color: '#F05032', progress: 95, category: 'cloud' },
  { name: 'GitLab', level: 'Intermediate', tagline: 'Internal Code Repository Hooks & Pipelines', statusBadge: 'COMMITTED', color: '#FC6D26', progress: 85, category: 'cloud' },
  { name: 'AWS', level: 'Intermediate', tagline: 'Cloud Instance Provisioning & S3 Data Storage', statusBadge: 'CLOUD-OPS', color: '#FF9900', progress: 82, category: 'cloud' },
  { name: 'Vercel', level: 'Advanced', tagline: 'Serverless Edge Functions & Frontend Pipelines', statusBadge: 'DEPLOYED', color: '#FFFFFF', progress: 95, category: 'cloud' },
  { name: 'Render', level: 'Advanced', tagline: 'Dynamic Backend Hosting & Auto-Deploys', statusBadge: 'HOSTED', color: '#46E3B7', progress: 90, category: 'cloud' },
  { name: 'CI/CD Pipelines', level: 'Intermediate', tagline: 'Automated Build Checks & Verification Triggers', statusBadge: 'AUTOMATED', color: '#A855F7', progress: 88, category: 'cloud' },
  
  // Tools & IDEs
  { name: 'VS Code', level: 'Advanced', tagline: 'Modern Development Workspace & Workspace Customizations', statusBadge: 'IDE-MAIN', color: '#007ACC', progress: 98, category: 'tools' },
  { name: 'Cursor', level: 'Advanced', tagline: 'AI-Integrated Next-Gen Code Editor Platform', statusBadge: 'AI-ASSIST', color: '#38BDF8', progress: 95, category: 'tools' },
  { name: 'Figma', level: 'Intermediate', tagline: 'UI Wireframing & Modern UX Prototyping', statusBadge: 'DESIGNED', color: '#F24E1E', progress: 80, category: 'tools' },
  { name: 'MySQL', level: 'Advanced', tagline: 'Relational Schema Operations & Transaction Logs', statusBadge: 'DB-ENGINE', color: '#4479A1', progress: 92, category: 'tools' },
  { name: 'MongoDB', level: 'Intermediate', tagline: 'NoSQL Document Schemas & Dynamic Aggregations', statusBadge: 'NOSQL-DB', color: '#47A248', progress: 86, category: 'tools' },
  { name: 'Postman', level: 'Advanced', tagline: 'Endpoint Integrations & Automated Testing Chains', statusBadge: 'TESTED', color: '#FF6C37', progress: 95, category: 'tools' },
  { name: 'JetBrains', level: 'Advanced', tagline: 'IntelliJ & PyCharm System Native IDEs', statusBadge: 'IDE-COMP', color: '#000000', progress: 90, category: 'tools' },
  { name: 'Linux', level: 'Advanced', tagline: 'Shell Scripts, Cron Schedules & Server Admin', statusBadge: 'OS-CORE', color: '#FCC624', progress: 92, category: 'tools' },
  { name: 'Firebase', level: 'Intermediate', tagline: 'Database sync, Cloud Functions & Authentications', statusBadge: 'FIRE-OPS', color: '#FFCA28', progress: 85, category: 'tools' },
  { name: 'Bun', level: 'Intermediate', tagline: 'Fast JavaScript Runtime & Package Execution Engine', statusBadge: 'RUNTIME-FAST', color: '#F9F1E7', progress: 82, category: 'tools' }
];

interface Badge {
  id: number;
  name: string;
  desc: string;
  color: string;
}

const BADGES_DATA: Badge[] = [
  { id: 1, name: 'Azure Fundamentals', desc: 'Core cloud structures, service frameworks, security modules, and Azure database management architectures.', color: '#0089d6' },
  { id: 2, name: 'DevOps Expert', desc: 'Validated practices for continuous integration, pipeline delivery configurations, and containerization automation.', color: '#8a2be2' },
  { id: 3, name: 'Azure AI Associate', desc: 'Design models for speech synthesis, natural language processing patterns, and computer vision deployment.', color: '#ec4899' },
  { id: 4, name: 'Power Apps Creator', desc: 'Synthesizing cloud data connectors, flow parameters, and responsive canvas applications with zero downtime.', color: '#22c55e' },
  { id: 5, name: 'C# Professional', desc: 'Competence in typed variables, memory optimization systems, asynchronous programming, and .NET compilations.', color: '#f59e0b' }
];

// High-fidelity original tech icons SVG definitions
const TECH_ICONS: Record<string, React.ReactNode> = {
  'Python': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.25 0.18C15.15 0.18 15.91 0.94 15.91 1.84V4.61H12.58V5.16H15.91V8.49C15.91 9.39 15.15 10.15 14.25 10.15H9.82C8.92 10.15 8.16 9.39 8.16 8.49V5.16C8.16 4.26 8.92 3.5 9.82 3.5H14.25V0.18Z" fill="#3776AB"/>
      <path d="M9.75 23.82C8.85 23.82 8.09 23.06 8.09 22.16V19.39H11.42V18.84H8.09V15.51C8.09 14.61 8.85 13.85 9.75 13.85H14.18C15.08 13.85 15.84 14.61 15.84 15.51V18.84C15.84 19.74 15.08 20.5 14.18 20.5H9.75V23.82Z" fill="#FFD343"/>
      <circle cx="11.2" cy="6.2" r="0.8" fill="#FFF"/>
      <circle cx="12.8" cy="17.8" r="0.8" fill="#FFF"/>
    </svg>
  ),
  'JavaScript': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="3" fill="#F7DF1E"/>
      <path d="M18.8 17.2C18.8 15.5 17.8 14.6 15.9 14.6C14.7 14.6 13.9 15.1 13.4 15.8L14.7 16.6C15.1 16.1 15.5 15.8 15.9 15.8C16.6 15.8 17 16.2 17 16.8V16.9C16.5 16.7 15.9 16.6 15.1 16.6C13.6 16.6 12.5 17.4 12.5 18.7C12.5 19.9 13.6 20.6 14.8 20.6C15.9 20.6 16.6 20.1 17 19.4H17.1V20.4H18.8V17.2ZM14.7 19.4C14.3 19.4 13.9 19.2 13.9 18.7C13.9 18.2 14.3 18 14.7 18H17V18.7C17 19.2 16.6 19.4 16 19.4H14.7ZM10.5 18C10.1 17.5 9.8 17.2 9.3 17.2C8.7 17.2 8.5 17.4 8.5 17.9C8.5 18.5 9 18.7 9.8 19C11.2 19.4 12.2 19.7 12.2 21.3C12.2 22.7 11.1 23.6 9.4 23.6C8 23.6 7 23 6.5 22L7.8 21.2C8.2 21.7 8.7 22 9.4 22C10.1 22 10.5 21.8 10.5 21.3C10.5 20.7 10 20.5 9.2 20.2C7.9 19.8 6.8 19.5 6.8 17.9C6.8 16.5 7.9 15.6 9.3 15.6C10.5 15.6 11.3 16.1 11.8 16.8L10.5 18Z" fill="#1D1B18"/>
    </svg>
  ),
  'TypeScript': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="3" fill="#3178C6"/>
      <path d="M18.8 17.2C18.8 15.5 17.8 14.6 15.9 14.6C14.7 14.6 13.9 15.1 13.4 15.8L14.7 16.6C15.1 16.1 15.5 15.8 15.9 15.8C16.6 15.8 17 16.2 17 16.8V16.9C16.5 16.7 15.9 16.6 15.1 16.6C13.6 16.6 12.5 17.4 12.5 18.7C12.5 19.9 13.6 20.6 14.8 20.6C15.9 20.6 16.6 20.1 17 19.4H17.1V20.4H18.8V17.2ZM14.7 19.4C14.3 19.4 13.9 19.2 13.9 18.7C13.9 18.2 14.3 18 14.7 18H17V18.7C17 19.2 16.6 19.4 16 19.4H14.7ZM6.5 15.6H12.3V17.3H10.1V23.6H8.3V17.3H6.5V15.6Z" fill="#FFF"/>
    </svg>
  ),
  'C': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22C15.71 22 18.96 19.98 20.7 16.98L18.96 15.98C17.51 18.48 14.97 20 12 20C7.58 20 4 16.42 4 12S7.58 4 12 4C14.97 4 17.51 5.52 18.96 8.02L20.7 7.02C18.96 4.02 15.71 2 12 2Z" fill="#A8B9CC"/>
    </svg>
  ),
  'C++': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 2C4.36 2 1 5.36 1 9.5S4.36 17 8.5 17C11.28 17 13.72 15.48 15.02 13.24L13.72 12.49C12.63 14.36 10.72 15.5 8.5 15.5C5.19 15.5 2.5 12.81 2.5 9.5S5.19 3.5 8.5 3.5C10.72 3.5 12.63 4.64 13.72 6.51L15.02 5.76C13.72 3.52 11.28 2 8.5 2Z" fill="#00599C"/>
      <path d="M19 8V6H17.5V8H15.5V9.5H17.5V11.5H19V9.5H21V8H19Z" fill="#00599C"/>
      <path d="M24 8V6H22.5V8H20.5V9.5H22.5V11.5H24V9.5H26V8H24Z" fill="#00599C"/>
    </svg>
  ),
  'Java': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M13.2 2C13.2 2 12.8 3.8 11.2 4.9C9.6 6 8.3 8.3 8.3 10.3C8.3 12.3 9.4 13.5 11.2 13.5C13.2 13.5 14.7 12 14.7 10.3C14.7 8.6 13.8 6.9 13.2 5C12.6 3.1 13.2 2 13.2 2Z" fill="#F8981D"/>
      <path d="M8 15.5C8 15.5 10 14 12 14C14 14 16.5 15 16.5 16.5C16.5 18 14 19.5 11.5 19.5C9 19.5 8 18 8 16.5ZM4.5 21C4.5 21 8.5 19 12.5 19C16.5 19 20.5 21 20.5 21" stroke="#F8981D" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  ),
  'SQL': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 3.79 2 6V18C2 20.21 4.48 22 12 22S22 20.21 22 18V6C22 3.79 17.52 2 12 2ZM20 6C20 6.57 16.82 8 12 8S4 6.57 4 6s3.18-2 8-2 8 1.43 8 2ZM4 12V8.72C5.78 9.69 8.7 10.36 12 10.36S18.22 9.69 20 8.72V12C20 12.57 16.82 14 12 14S4 12.57 4 12ZM4 18V14.72C5.78 15.69 8.7 16.36 12 16.36S18.22 15.69 20 14.72V18C20 18.57 16.82 20 12 20S4 18.57 4 18Z" fill="#00758F"/>
    </svg>
  ),
  // Frameworks
  'Django': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#092E20"/>
      <path d="M7 6H9.2V16.3H12V18H7V6ZM12.5 11.2C12.5 8.9 14.1 7.2 16.5 7.2C18.9 7.2 20.5 8.9 20.5 11.2V13.8C20.5 16.1 18.9 17.8 16.5 17.8C14.1 17.8 12.5 16.1 12.5 13.8V11.2ZM14.3 11.2C14.3 12.6 15.1 13.5 16.5 13.5C17.9 13.5 18.7 12.6 18.7 11.2V13.8C18.7 12.4 17.9 11.5 16.5 11.5C15.1 11.5 14.3 12.4 14.3 13.8V11.2Z" fill="#FFF"/>
    </svg>
  ),
  'Node.js': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L2 7.8V19.2L12 25L22 19.2V7.8L12 2Z" fill="#339933"/>
      <path d="M12 4.3L4.5 8.6V17.2L12 21.5L19.5 17.2V8.6L12 4.3ZM12 8.6L16.5 11.2V16.4L12 13.8V8.6Z" fill="#FFF"/>
    </svg>
  ),
  'Express.js': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#333333"/>
      <path d="M7 8H13V9.5H9.5V11.5H12.5V13H9.5V15.5H13V17H7V8ZM14.5 11.5L16.5 8H18.5L15.8 12.2L18.5 17H16.5L14.5 13.5L12.5 17H10.5L13.2 12.2L10.5 8H12.5L14.5 11.5Z" fill="#FFF"/>
    </svg>
  ),
  // DevOps
  'Docker': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2.7 9H4.8V10.8H2.7V9ZM5.4 9H7.5V10.8H5.4V9ZM8.1 9H10.2V10.8H8.1V9ZM10.8 9H12.9V10.8H10.8V9ZM5.4 6.6H7.5V8.4H5.4V6.6ZM8.1 6.6H10.2V8.4H8.1V6.6ZM10.8 6.6H12.9V8.4H10.8V6.6ZM13.5 6.6H15.6V8.4H13.5V6.6ZM13.5 9H15.6V10.8H13.5V9Z" fill="#2496ED"/>
      <path d="M23.6 10.3C23 10 21.8 10 21 10.5C20.5 9.8 19.6 9.4 18.5 9.4C17.6 9.4 16.8 9.8 16.2 10.5H1.1V17.8C1.1 18.2 1.4 18.5 1.8 18.5C9.8 18.5 16.2 16.8 17.9 12.5C18.5 12.2 18.8 11.8 19.1 11.3C19.5 11.7 20 11.8 20.6 11.8H20.8C21.2 11.8 21.5 11.5 21.5 11.1V10.1C21.5 9.8 21.3 9.5 21.1 9.4C21 9.3 20.8 9.3 20.7 9.3C21.7 9.3 22.8 9.5 23.6 10.3Z" fill="#2496ED"/>
    </svg>
  ),
  'Git/GitHub': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.87 20.17 8.84 21.49C9.34 21.58 9.52 21.28 9.52 21.01C9.52 20.77 9.51 20.14 9.51 19.3C6.77 19.9 6.19 17.99 6.19 17.99C5.74 16.84 5.08 16.53 5.08 16.53C4.17 15.91 5.15 15.92 5.15 15.92C6.16 15.99 6.69 16.96 6.69 16.96C7.58 18.49 9.03 18.05 9.6 17.8C9.69 17.16 9.95 16.72 10.24 16.47C8.02 16.22 5.69 15.36 5.69 11.53C5.69 10.44 6.08 9.55 6.72 8.85C6.62 8.6 6.28 7.58 6.82 6.2C6.82 6.2 7.66 5.93 9.57 7.22C10.37 7 11.22 6.89 12.07 6.89C12.92 6.89 13.77 7 14.57 7.22C16.48 5.93 17.32 6.2 17.32 6.2C17.86 7.58 17.52 8.6 17.42 8.85C18.06 9.55 18.45 10.44 18.45 11.53C18.45 15.37 16.11 16.22 13.88 16.47C14.24 16.78 14.56 17.39 14.56 18.32C14.56 19.65 14.55 20.73 14.55 21.05C14.55 21.32 14.73 21.63 15.24 21.53C19.21 20.21 22 16.46 22 12C22 6.477 17.52 2 12 2Z" fill="#F05032"/>
    </svg>
  ),
  'GitLab': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.65 14.39L12 22.13L1.35 14.39C1.1 14.21 1 13.9 1 13.62L3.3 6.56C3.4 6.28 3.65 6.09 3.95 6.09H20.05C20.35 6.09 20.6 6.28 20.7 6.56L23 13.62C23 13.9 22.9 14.21 22.65 14.39Z" fill="#FC6D26"/>
      <path d="M12 22.13L20.05 6.09H3.95L12 22.13Z" fill="#E24329"/>
    </svg>
  ),
  'AWS': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.4 12.3C12.4 10.7 11.2 9.9 9.8 9.9C8.3 9.9 7.4 10.8 7.4 12.2C7.4 13.6 8.3 14.5 9.8 14.5C11.2 14.5 12.4 13.7 12.4 12.3ZM14.1 12.3C14.1 14.7 12.1 16 9.8 16C7.5 16 5.6 14.5 5.6 12.2C5.6 9.9 7.5 8.4 9.8 8.4C12.1 8.4 14.1 9.8 14.1 12.3Z" fill="#FF9900"/>
      <path d="M15.4 7.2L13.8 8.5C14.6 9.4 15 10.6 15 12.1C15 14.5 13.4 15.5 11.8 15.5H9.8C8.2 15.5 6.6 14.5 6.6 12.1C6.6 9.7 8.2 8.7 9.8 8.7H10.4C10.7 8.7 11 8.6 11.2 8.4L10.5 7H9.8C6.9 7 4.5 8.9 4.5 12.1C4.5 15.3 6.9 17.2 9.8 17.2H11.8C14.7 17.2 17.1 15.3 17.1 12.1C17.1 10.1 16.5 8.5 15.4 7.2Z" fill="#FF9900"/>
      <path d="M2.5 19.5C5.8 22.1 10.3 23 14.6 23C18.2 23 21.7 21.8 24.3 19.7C24.6 19.4 24.4 19 24 19.1C20.6 20 17 20.3 13.5 20.3C9.7 20.3 6 19.8 2.5 18.8C2.1 18.7 1.9 19.1 2.5 19.5Z" fill="#FF9900"/>
    </svg>
  ),
  'Vercel': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 1L24 22H0L12 1Z" fill="#FAF6EE"/>
    </svg>
  ),
  'Render': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 18H12.5V12.5H20V18ZM20 11H12.5V6H20V11ZM11 6V11H4V6H11ZM4 12.5H11V18H4V12.5Z" fill="#46E3B7"/>
    </svg>
  ),
  'CI/CD Pipelines': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="20" height="20" rx="4" stroke="#A855F7" strokeWidth="2"/>
      <circle cx="7" cy="7" r="2" fill="#A855F7"/>
      <circle cx="17" cy="17" r="2" fill="#A855F7"/>
      <path d="M7 9V17H15" stroke="#A855F7" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  // Tools
  'VS Code': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.8 5.7L17.5 0.7C17.2 0.4 16.7 0.4 16.4 0.7L11.5 5.6L3.4 1.3C3.1 1.1 2.7 1.2 2.5 1.5L0.2 4.8C-0.1 5.1 -0.1 5.6 0.2 5.9L5.3 11L0.2 16.1C-0.1 16.4 -0.1 16.9 0.2 17.2L2.5 20.5C2.7 20.8 3.1 20.9 3.4 20.7L11.5 16.4L16.4 21.3C16.7 21.6 17.2 21.6 17.5 21.3L22.8 16.3C23.1 16 23.1 15.5 22.8 15.2L17.5 11L22.8 6.8C23.1 6.5 23.1 6 22.8 5.7Z" fill="#007ACC"/>
    </svg>
  ),
  'Figma': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5 0A3.5 3.5 0 0 0 5 3.5v3A3.5 3.5 0 0 0 8.5 10H12V3.5A3.5 3.5 0 0 0 8.5 0z" fill="#F24E1E"/>
      <path d="M15.5 0A3.5 3.5 0 0 0 12 3.5V10h3.5A3.5 3.5 0 0 0 19 6.5A3.5 3.5 0 0 0 15.5 0z" fill="#FF7262"/>
      <path d="M8.5 10A3.5 3.5 0 0 0 5 13.5v3A3.5 3.5 0 0 0 8.5 20a3.5 3.5 0 0 0 3.5-3.5V10H8.5z" fill="#1ABC9C"/>
      <path d="M15.5 10A3.5 3.5 0 0 0 12 13.5v3a3.5 3.5 0 0 0 3.5 3.5a3.5 3.5 0 0 0 3.5-3.5a3.5 3.5 0 0 0-3.5-3.5" fill="#A259FF"/>
      <circle cx="15.5" cy="12" r="3.5" fill="#F24E1E"/>
    </svg>
  ),
  'MySQL': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 3.79 2 6V18C2 20.21 4.48 22 12 22S22 20.21 22 18V6C22 3.79 17.52 2 12 2ZM20 6C20 6.57 16.82 8 12 8S4 6.57 4 6s3.18-2 8-2 8 1.43 8 2Z" fill="#4479A1"/>
      <path d="M4 12V8.72C5.78 9.69 8.7 10.36 12 10.36S18.22 9.69 20 8.72V12C20 12.57 16.82 14 12 14S4 12.57 4 12ZM4 18V14.72C5.78 15.69 8.7 16.36 12 16.36S18.22 15.69 20 14.72V18C20 18.57 16.82 20 12 20S4 18.57 4 18Z" fill="#4479A1"/>
    </svg>
  ),
  'MongoDB': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.4 1.2C12.2 1 11.2 0 11.2 0C11.2 0 10.2 1 10 1.2C7.3 3.8 5.7 7.4 5.7 10.8C5.7 13.9 6.8 16.5 8.7 18.1V22C8.7 22.8 9.4 23.5 10.2 23.5C11 23.5 11.7 22.8 11.7 22V19.1C13.6 17.5 14.7 14.9 14.7 10.8C14.7 7.4 13.1 3.8 12.4 1.2ZM10.2 16.5C9 15.3 8.3 13.5 8.3 10.8C8.3 7.8 9.5 5 10.2 3.8V16.5ZM11.7 16.5V3.8C12.4 5 13.6 7.8 13.6 10.8C13.6 13.5 12.9 15.3 11.7 16.5Z" fill="#47A248"/>
    </svg>
  ),
  'Postman': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM11 6H13V12H11V6ZM11 14H13V16H11V14Z" fill="#FF6C37"/>
    </svg>
  ),
  'JetBrains': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="4" fill="#000000"/>
      <path d="M4 4H20V20H4V4ZM6 6H18V18H6V6Z" fill="#FFF"/>
      <path d="M9 9H11V15H9V9ZM12 9H15V11H12V9Z" fill="#FFF"/>
    </svg>
  ),
  'Linux': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM11 6H13V12H11V6ZM11 14H13V16H11V14Z" fill="#FCC624"/>
    </svg>
  ),
  'Cursor': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 3l11 11-4 1 3.5 5.5-2.5 1.5-3.5-5.5-2.5 4V3Z" fill="#38BDF8"/>
    </svg>
  ),
  'Firebase': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.89 15.75L10.22 2.3C10.35 2 10.75 2 10.88 2.3L13.25 7.32L3.89 15.75Z" fill="#FFCA28"/>
      <path d="M20.11 15.75L12 23L20.11 15.75Z" fill="#FF8F00"/>
      <path d="M14.54 8.23L17.38 14.26L20.11 8.48C20.25 8.18 19.56 7.68 19.14 8.06L14.54 8.23Z" fill="#FFCA28"/>
    </svg>
  ),
  'Bun': (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" fill="#F9F1E7" stroke="#000" strokeWidth="1.5"/>
      <circle cx="9" cy="10" r="1.5" fill="#000"/>
      <circle cx="15" cy="10" r="1.5" fill="#000"/>
      <path d="M8 14.5C8 14.5 10 16 12 16C14 16 16 14.5 16 14.5" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
};

export default function DevArsenal() {
  const [activeTab, setActiveTab] = useState<'arsenal' | 'codex'>('arsenal');
  const [selectedBadge, setSelectedBadge] = useState<number>(1);
  const [activeCategory, setActiveCategory] = useState<'languages' | 'frameworks' | 'cloud' | 'tools'>('languages');
  const [tooltipText, setTooltipText] = useState<string | null>(null);

  // LeetCode / Microsoft / Google profile copy registration helper status
  const [copiedLC, setCopiedLC] = useState<boolean>(false);
  const [copiedMS, setCopiedMS] = useState<boolean>(false);

  // Card cursor spotlight coordinates
  const [lcSpot, setLcSpot] = useState({ x: -1000, y: -1000 });
  const [msSpot, setMsSpot] = useState({ x: -1000, y: -1000 });
  const [gcSpot, setGcSpot] = useState({ x: -1000, y: -1000 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arsenalPanelRef = useRef<HTMLDivElement>(null);
  const codexPanelRef = useRef<HTMLDivElement>(null);
  const leetCodeCardRef = useRef<HTMLDivElement>(null);
  const msLearnCardRef = useRef<HTMLDivElement>(null);
  const gCloudCardRef = useRef<HTMLDivElement>(null);

  // 3D Card Tilt States
  const [lcTilt, setLcTilt] = useState({ x: 0, y: 0 });
  const [msTilt, setMsTilt] = useState({ x: 0, y: 0 });
  const [gcTilt, setGcTilt] = useState({ x: 0, y: 0 });

  // Refs for skills grid elements to animate on category change
  const skillsGridRef = useRef<HTMLDivElement>(null);

  // HUD Categories config
  const CATEGORIES = [
    { id: 'languages', label: 'Languages', code: '01', icon: Code },
    { id: 'frameworks', label: 'Frameworks', code: '02', icon: Layers },
    { id: 'cloud', label: 'DevOps & Deploy', code: '03', icon: Cloud },
    { id: 'tools', label: 'Tools & IDEs', code: '04', icon: Wrench }
  ] as const;

  // Handle Tab Switch (Arsenal / Codex) with GSAP
  const handleTabToggle = (tab: 'arsenal' | 'codex') => {
    if (tab === activeTab) return;

    const fadeOutTarget = tab === 'arsenal' ? codexPanelRef.current : arsenalPanelRef.current;
    const fadeInTarget = tab === 'arsenal' ? arsenalPanelRef.current : codexPanelRef.current;

    gsap.to(fadeOutTarget, {
      opacity: 0,
      y: 15,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        setActiveTab(tab);
        setTimeout(() => {
          gsap.fromTo(fadeInTarget,
            { opacity: 0, y: -15 },
            { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
          );
        }, 30);
      }
    });
  };

  // Handle Category Switch with GSAP Stagger Reveal
  const handleCategorySwitch = (catId: 'languages' | 'frameworks' | 'cloud' | 'tools') => {
    if (catId === activeCategory) return;

    gsap.to('.skill-hud-card', {
      opacity: 0,
      scale: 0.95,
      y: 8,
      stagger: 0.02,
      duration: 0.15,
      ease: 'power2.in',
      onComplete: () => {
        setActiveCategory(catId);
        setTimeout(() => {
          gsap.fromTo('.skill-hud-card',
            { opacity: 0, scale: 0.95, y: -8 },
            { opacity: 1, scale: 1, y: 0, stagger: 0.04, duration: 0.4, ease: 'power2.out' }
          );
        }, 30);
      }
    });
  };

  // Background Constellation Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrame: number;
    const points: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    const maxPoints = 25;

    const initCanvas = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);

    for (let i = 0; i < maxPoints; i++) {
      points.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.6
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#080706';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.003)';
      ctx.lineWidth = 1;
      const step = 45;
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

      ctx.lineWidth = 0.5;
      for (let i = 0; i < points.length; i++) {
        const p1 = points[i];
        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < 0 || p1.x > canvas.width) p1.vx *= -1;
        if (p1.y < 0 || p1.y > canvas.height) p1.vy *= -1;

        ctx.beginPath();
        ctx.arc(p1.x, p1.y, p1.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(249, 199, 210, 0.2)';
        ctx.fill();

        for (let j = i + 1; j < points.length; j++) {
          const p2 = points[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.08;
            ctx.strokeStyle = `rgba(250, 246, 238, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      animFrame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', initCanvas);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // Entrance reveal
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    gsap.fromTo('.dev-reveal-title',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.75,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%'
        }
      }
    );
  }, []);

  // Card Mouse spotlight + tilt triggers
  const handleLCMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = leetCodeCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setLcSpot({ x, y });

    const rx = ((y / rect.height) - 0.5) * -7;
    const ry = ((x / rect.width) - 0.5) * 7;
    setLcTilt({ x: rx, y: ry });
  };

  const handleMSMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = msLearnCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMsSpot({ x, y });

    const rx = ((y / rect.height) - 0.5) * -7;
    const ry = ((x / rect.width) - 0.5) * 7;
    setMsTilt({ x: rx, y: ry });
  };

  const handleGCMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = gCloudCardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setGcSpot({ x, y });

    const rx = ((y / rect.height) - 0.5) * -7;
    const ry = ((x / rect.width) - 0.5) * 7;
    setGcTilt({ x: rx, y: ry });
  };

  // LeetCode Solved Heatmap
  const generateLCHeatmap = () => {
    const cells = [];
    const seed = [4, 3, 2, 4, 3, 0, 1, 4, 3, 4, 2, 4, 3, 4, 1, 3];
    
    for (let c = 0; c < 16; c++) {
      for (let r = 0; r < 7; r++) {
        const dayIdx = c * 7 + r;
        const rawDensity = (seed[(c + r) % seed.length] + (dayIdx > 85 ? 1 : 0)) % 5;
        const dateStr = `Day ${900 - 112 + dayIdx}`;

        let bgClass = 'bg-[#282119]';
        if (rawDensity === 1) bgClass = 'bg-[#9a3412]/30';
        if (rawDensity === 2) bgClass = 'bg-[#c2410c]/50';
        if (rawDensity === 3) bgClass = 'bg-[#ea580c]/70';
        if (rawDensity === 4) bgClass = 'bg-[#f97316]';

        cells.push(
          <div 
            key={`${c}-${r}`}
            onMouseEnter={() => setTooltipText(`${dateStr}: Active coding streak solved.`)}
            onMouseLeave={() => setTooltipText(null)}
            className={`w-3.5 h-3.5 rounded-sm transition-all duration-300 hover:scale-125 cursor-pointer hover:shadow-[0_0_8px_rgba(249,115,22,0.5)] ${bgClass}`}
          />
        );
      }
    }
    return cells;
  };

  // State for skill card hover spotlights
  const [activeSkillHover, setActiveSkillHover] = useState<string | null>(null);
  const [skillSpot, setSkillSpot] = useState({ x: 0, y: 0 });
  const [skillTilt, setSkillTilt] = useState({ x: 0, y: 0 });

  const handleSkillMouseMove = (e: React.MouseEvent<HTMLDivElement>, skillName: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setSkillSpot({ x, y });

    const rx = ((y / rect.height) - 0.5) * -10; // max 10 deg
    const ry = ((x / rect.width) - 0.5) * 10;
    setSkillTilt({ x: rx, y: ry });
    setActiveSkillHover(skillName);
  };

  const handleSkillMouseLeave = () => {
    setActiveSkillHover(null);
    setSkillTilt({ x: 0, y: 0 });
  };

  const activeBadgeInfo = BADGES_DATA.find(b => b.id === selectedBadge) || BADGES_DATA[0];
  const activeSkillsList = SKILLS_DATA.filter(s => s.category === activeCategory);

  return (
    <section 
      ref={containerRef}
      className="w-full bg-[#080706] text-[#FAF6EE] py-24 md:py-32 border-t border-[#d3c2c5]/15 relative overflow-hidden"
      id="arsenal"
    >
      {/* Background constellation */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0 opacity-40" />

      {/* Grid Pattern overlays */}
      <div className="absolute inset-0 opacity-[0.012] bg-[radial-gradient(#FAF6EE_1.5px,transparent_1.5px)] [background-size:24px_24px] pointer-events-none z-1" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-16 lg:px-24 relative z-10">
        
        {/* Title & Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-20 dev-reveal-title">
          <div>
            <span className="font-mono text-xs text-[#f9c7d2] uppercase tracking-widest block mb-2 font-bold">
              Kunal's Arsenal & Codex
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[#FAF6EE] uppercase">
              ARSENAL & CODEX
            </h2>
            <div className="w-12 h-1 bg-[#f9c7d2] mt-4 rounded-full" />
          </div>

          {/* Toggle Navigation Bar */}
          <div className="flex bg-white/[0.03] border border-white/10 rounded-full p-1 self-start md:self-auto backdrop-blur-md">
            <button
              onClick={() => handleTabToggle('arsenal')}
              className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === 'arsenal'
                  ? 'bg-[#f9c7d2] text-[#080706] shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Arsenal (Skills)
            </button>
            <button
              onClick={() => handleTabToggle('codex')}
              className={`px-6 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                activeTab === 'codex'
                  ? 'bg-[#ffc700] text-[#080706] shadow-lg'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Codex (Stats)
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* PANEL 1: ARSENAL (Tech Stack & Tools HUD Redesign)             */}
        {/* ============================================================== */}
        <div 
          ref={arsenalPanelRef} 
          className={`flex flex-col lg:flex-row gap-8 items-start ${activeTab === 'arsenal' ? 'flex' : 'hidden'}`}
        >
          {/* Left HUD Category Selector */}
          <div className="w-full lg:w-1/4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar select-none flex-shrink-0">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySwitch(cat.id)}
                  className={`flex-shrink-0 flex items-center justify-between text-left px-5 py-4.5 rounded-2xl border transition-all duration-500 cursor-pointer lg:w-full group ${
                    activeCategory === cat.id 
                      ? 'bg-white/10 border-white/15 text-white shadow-lg lg:border-l-4 lg:border-l-[#f9c7d2]' 
                      : 'bg-transparent border-transparent text-white/40 hover:text-white/80 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span className="font-mono text-xs opacity-40 font-bold">
                      {cat.code}
                    </span>
                    <span className="font-serif text-base font-bold">
                      {cat.label}
                    </span>
                  </div>
                  <IconComp className={`w-4 h-4 opacity-50 group-hover:scale-110 transition-transform duration-300 ${
                    activeCategory === cat.id ? 'text-[#f9c7d2] opacity-90' : ''
                  }`} />
                </button>
              );
            })}
          </div>

          {/* Right Skills Grid Display */}
          <div 
            ref={skillsGridRef}
            className="w-full lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 gap-5"
          >
            {activeSkillsList.map((skill, i) => {
              const isHovered = activeSkillHover === skill.name;
              return (
                <div
                  key={i}
                  onMouseMove={(e) => handleSkillMouseMove(e, skill.name)}
                  onMouseLeave={handleSkillMouseLeave}
                  style={{
                    transform: isHovered 
                      ? `perspective(800px) rotateX(${skillTilt.x}deg) rotateY(${skillTilt.y}deg) scale(1.02)` 
                      : 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)',
                    transition: isHovered ? 'none' : 'transform 0.3s cubic-bezier(0.25, 1, 0.5, 1)',
                    boxShadow: isHovered ? `0 10px 30px -10px ${skill.color}50` : 'none'
                  }}
                  className="skill-hud-card p-5.5 bg-[#141211]/85 border border-white/10 rounded-2xl relative overflow-hidden group/item flex flex-col justify-between min-h-[148px]"
                >
                  {/* Dynamic brand-color spotlight overlay */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 z-0"
                    style={{
                      background: isHovered 
                        ? `radial-gradient(180px circle at ${skillSpot.x}px ${skillSpot.y}px, ${skill.color}15, transparent 80%)` 
                        : 'none'
                    }}
                  />
                  
                  {/* Glowing border outline */}
                  <div 
                    className="absolute inset-0 pointer-events-none rounded-2xl border transition-opacity duration-300 z-1"
                    style={{
                      borderColor: skill.color,
                      opacity: isHovered ? 0.35 : 0,
                      maskImage: isHovered ? `radial-gradient(90px circle at ${skillSpot.x}px ${skillSpot.y}px, black, transparent)` : 'none',
                      WebkitMaskImage: isHovered ? `radial-gradient(90px circle at ${skillSpot.x}px ${skillSpot.y}px, black, transparent)` : 'none'
                    }}
                  />

                  {/* Header info */}
                  <div className="flex items-start justify-between gap-3 z-10 relative">
                    <div className="flex items-center gap-3">
                      {/* Original Brand colored SVG logo */}
                      <div className="flex-shrink-0 p-1.5 bg-black/40 border border-white/5 rounded-xl flex items-center justify-center min-w-[40px] min-h-[40px] shadow-inner group-hover/item:border-white/15 transition-all">
                        {TECH_ICONS[skill.name] || <Code className="w-5 h-5 opacity-40" />}
                      </div>
                      
                      <div className="text-left">
                        <span className="block font-serif text-base font-bold text-white group-hover/item:text-[#f9c7d2] transition-colors duration-300">
                          {skill.name}
                        </span>
                        <span className="block text-[10px] font-mono text-white/40 uppercase tracking-wider mt-0.5">
                          {skill.level}
                        </span>
                      </div>
                    </div>

                    <span className="text-[8px] font-mono border border-white/10 px-2 py-0.5 rounded-full text-white/45 bg-white/5 select-none font-bold tracking-widest uppercase">
                      {skill.statusBadge}
                    </span>
                  </div>

                  {/* Center skill tagline description */}
                  <p className="font-sans text-xs text-white/60 font-light leading-relaxed text-left z-10 relative mt-3.5 mb-4 max-w-[90%]">
                    {skill.tagline}
                  </p>

                  {/* Footer dynamic progress bar */}
                  <div className="w-full z-10 relative">
                    <div className="flex justify-between items-center text-[9px] font-mono text-white/30 mb-1">
                      <span>STABILITY INDEX</span>
                      <span style={{ color: isHovered ? skill.color : 'rgba(250,246,238,0.5)' }} className="transition-colors duration-300 font-bold">
                        {skill.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div 
                        style={{ 
                          width: `${skill.progress}%`,
                          background: isHovered 
                            ? `linear-gradient(to right, ${skill.color}50, ${skill.color})` 
                            : 'rgba(250, 246, 238, 0.15)'
                        }}
                        className="h-full rounded-full transition-all duration-500 ease-out"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* PANEL 2: CODEX (Stats & Credentials)                           */}
        {/* ============================================================== */}
        <div 
          ref={codexPanelRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch opacity-0 ${activeTab === 'codex' ? 'grid' : 'hidden'}`}
        >
          {/* A. LeetCode Streak Card */}
          <div 
            ref={leetCodeCardRef}
            onMouseMove={handleLCMove}
            onMouseLeave={() => { setLcTilt({ x: 0, y: 0 }); setLcSpot({ x: -1000, y: -1000 }); }}
            style={{
              transform: `perspective(1000px) rotateX(${lcTilt.x}deg) rotateY(${lcTilt.y}deg)`,
              transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
            className="bg-[#141211]/85 border border-white/10 rounded-3xl p-6.5 backdrop-blur-md relative overflow-hidden group shadow-2xl flex flex-col justify-between min-h-[460px]"
          >
            {/* Spotlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
              style={{
                background: `radial-gradient(400px circle at ${lcSpot.x}px ${lcSpot.y}px, rgba(249, 115, 22, 0.08), transparent 80%)`
              }}
            />

            <div>
              {/* LeetCode Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5 z-10 relative">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-[#ea580c] animate-pulse" />
                  <span className="font-mono text-xs text-[#ea580c] tracking-widest font-bold">LEETCODE CODEX</span>
                </div>
                <span className="text-[8px] font-mono border border-orange-500/20 text-orange-500/80 px-2 py-0.5 rounded bg-orange-500/5 select-none font-bold">RANK 43,546</span>
              </div>

              {/* Large Metric */}
              <div className="flex items-center gap-5 mb-6 z-10 relative">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-600 to-amber-500 rounded-full blur opacity-45 group-hover:opacity-75 animate-pulse" />
                  <div className="w-16 h-16 rounded-full bg-[#1b1713] border border-orange-500/35 flex items-center justify-center relative">
                    <Flame className="w-8 h-8 text-orange-500 animate-bounce" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white">900+ Days</h3>
                  <p className="font-sans text-[10px] text-white/50 font-light mt-0.5 uppercase tracking-wider">Continuous Streak</p>
                </div>
              </div>

              {/* Solved Ratio Breakdown Grid */}
              <div className="mb-6 grid grid-cols-3 gap-2.5 z-10 relative">
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                  <span className="block text-xs font-mono text-[#4ade80] font-bold">245</span>
                  <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mt-0.5">Easy</span>
                </div>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                  <span className="block text-xs font-mono text-[#facc15] font-bold">506</span>
                  <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mt-0.5">Medium</span>
                </div>
                <div className="p-3 bg-black/40 border border-white/5 rounded-xl text-center">
                  <span className="block text-xs font-mono text-[#f87171] font-bold">150</span>
                  <span className="block text-[8px] font-mono text-white/30 uppercase tracking-widest mt-0.5">Hard</span>
                </div>
              </div>

              {/* Heatmap Grid */}
              <div className="z-10 relative mb-6">
                <div className="flex justify-between items-center text-[9px] font-mono text-white/40 mb-2">
                  <span className="uppercase tracking-widest font-bold">901 / 3,962 SOLVED</span>
                  <span>37 BADGES (500-DAY)</span>
                </div>
                <div className="flex gap-1.5 p-3.5 bg-black/50 border border-white/5 rounded-2xl overflow-x-auto no-scrollbar max-w-full justify-start items-center">
                  <div className="grid grid-flow-col grid-rows-7 gap-1.5 flex-shrink-0">
                    {generateLCHeatmap()}
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Profile link */}
            <div className="z-10 relative flex flex-col gap-3.5 border-t border-white/5 pt-4">
              <span className="text-[9px] font-mono text-white/40 leading-relaxed block text-left">
                {tooltipText ? tooltipText : '// Hover cells to inspect solved calendar logs.'}
              </span>
              <a
                href="https://leetcode.com/u/_Kunalsingh07/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-[#e28743]/10 border border-[#e28743]/30 hover:bg-[#e28743] hover:text-[#080706] text-[#e28743] rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>View LeetCode Profile</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* B. Microsoft Learn Badges Shelf */}
          <div 
            ref={msLearnCardRef}
            onMouseMove={handleMSMove}
            onMouseLeave={() => { setMsTilt({ x: 0, y: 0 }); setMsSpot({ x: -1000, y: -1000 }); }}
            style={{
              transform: `perspective(1000px) rotateX(${msTilt.x}deg) rotateY(${msTilt.y}deg)`,
              transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
            className="bg-[#141211]/85 border border-white/10 rounded-3xl p-6.5 backdrop-blur-md relative overflow-hidden group shadow-2xl flex flex-col justify-between min-h-[460px]"
          >
            {/* Spotlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
              style={{
                background: `radial-gradient(400px circle at ${msSpot.x}px ${msSpot.y}px, rgba(59, 130, 246, 0.08), transparent 80%)`
              }}
            />

            <div>
              {/* MS Learn Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5 z-10 relative">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-blue-400" />
                  <span className="font-mono text-xs text-blue-400 tracking-widest font-bold">MICROSOFT CODEX</span>
                </div>
                <span className="text-[8px] font-mono border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded bg-blue-500/5 select-none font-bold">CREDENTIALS</span>
              </div>

              {/* Large Metric */}
              <div className="flex items-center gap-5 mb-6 z-10 relative">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full blur opacity-45 group-hover:opacity-75 animate-pulse" />
                  <div className="w-16 h-16 rounded-full bg-[#13171b] border border-blue-500/35 flex items-center justify-center relative">
                    <Shield className="w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white">50+ Badges</h3>
                  <p className="font-sans text-[10px] text-white/50 font-light mt-0.5 uppercase tracking-wider">Microsoft Learn System Credentials</p>
                </div>
              </div>

              {/* Horizontal Badge Shelf */}
              <div className="z-10 relative mb-5">
                <span className="block text-[9px] font-mono text-white/40 uppercase tracking-widest mb-3 select-none font-bold">SHELF SELECTION</span>
                <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar justify-start">
                  {BADGES_DATA.map((badge) => (
                    <div 
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge.id)}
                      className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center border transition-all duration-300 cursor-pointer ${
                        selectedBadge === badge.id 
                          ? 'bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_12px_rgba(59,130,246,0.35)] scale-110' 
                          : 'bg-black/40 border-white/5 text-white/30 hover:border-white/20 hover:text-white/60'
                      }`}
                      title={badge.name}
                    >
                      <Shield className="w-4.5 h-4.5" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Selected Badge description detail panel */}
              <div className="bg-black/35 border border-white/5 rounded-2xl p-4.5 min-h-[92px] z-10 relative flex flex-col justify-center">
                <span className="block text-[10px] font-mono text-[#f9c7d2] uppercase font-bold tracking-wider mb-1">
                  {activeBadgeInfo.name}
                </span>
                <p className="font-sans text-[11px] text-white/70 leading-relaxed font-light">
                  {activeBadgeInfo.desc}
                </p>
              </div>
            </div>

            {/* CTA Profile link */}
            <div className="z-10 relative border-t border-white/5 pt-4">
              <a
                href="https://learn.microsoft.com/en-us/users/kunalsingh-4445/"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500 hover:text-white text-blue-400 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>View MS Learn Profile</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>

          {/* C. Google Cloud Codex Card */}
          <div 
            ref={gCloudCardRef}
            onMouseMove={handleGCMove}
            onMouseLeave={() => { setGcTilt({ x: 0, y: 0 }); setGcSpot({ x: -1000, y: -1000 }); }}
            style={{
              transform: `perspective(1000px) rotateX(${gcTilt.x}deg) rotateY(${gcTilt.y}deg)`,
              transition: 'transform 0.15s cubic-bezier(0.25, 1, 0.5, 1)'
            }}
            className="bg-[#141211]/85 border border-white/10 rounded-3xl p-6.5 backdrop-blur-md relative overflow-hidden group shadow-2xl flex flex-col justify-between min-h-[460px]"
          >
            {/* Spotlight */}
            <div 
              className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"
              style={{
                background: `radial-gradient(400px circle at ${gcSpot.x}px ${gcSpot.y}px, rgba(52, 168, 83, 0.08), transparent 80%)`
              }}
            />

            <div>
              {/* Google Cloud Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-5 z-10 relative">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-green-450 animate-pulse" />
                  <span className="font-mono text-xs text-green-400 tracking-widest font-bold">GOOGLE CLOUD</span>
                </div>
                <span className="text-[8px] font-mono border border-green-500/20 text-green-400 px-2 py-0.5 rounded bg-green-500/5 select-none font-bold">VERIFIED</span>
              </div>

              {/* Large Metric */}
              <div className="flex items-center gap-5 mb-6 z-10 relative">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 rounded-full blur opacity-45 group-hover:opacity-75 animate-pulse" />
                  <div className="w-16 h-16 rounded-full bg-[#131b15] border border-green-500/35 flex items-center justify-center relative">
                    <Laptop className="w-8 h-8 text-green-400 animate-bounce" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white">Skills Profile</h3>
                  <p className="font-sans text-[10px] text-white/50 font-light mt-0.5 uppercase tracking-wider">Google Skills Platform Codex</p>
                </div>
              </div>

              {/* Platform Info Badge */}
              <div className="bg-black/35 border border-white/5 rounded-2xl p-5 min-h-[160px] z-10 relative flex flex-col justify-center">
                <span className="block text-[10px] font-mono text-[#f9c7d2] uppercase font-bold tracking-wider mb-2">
                  Google Developer Credentials
                </span>
                <p className="font-sans text-[11px] text-white/70 leading-relaxed font-light mb-3">
                  A verified public profile showcasing technical badging completions, hands-on lab achievements, cloud architecture pathways, and serverless solution architectures.
                </p>
                <div className="flex items-center gap-1.5 text-[9px] font-mono text-white/40">
                  <Check className="w-3.5 h-3.5 text-[#10b981]" />
                  <span>Public Authentication Verified</span>
                </div>
              </div>
            </div>

            {/* CTA Profile link */}
            <div className="z-10 relative border-t border-white/5 pt-4">
              <a
                href="https://www.skills.google/public_profiles/ce70cc9e-09cf-491e-8058-70126e98dcf5"
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 bg-green-500/10 border border-green-500/30 hover:bg-green-500 hover:text-white text-green-400 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all"
              >
                <span>View Google Profile</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
