'use client';

import React, { useState, useEffect } from 'react';
import { 
  Lock, User, Mail, Folder, Calendar, LogOut, Plus, Trash2, Check, ArrowLeft, ArrowUpRight
} from 'lucide-react';
import Link from 'next/link';
import API from '../../utils/api';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  githubUrl: string;
  liveUrl: string;
  imagePath: string;
}

interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  description: string;
  location: string;
}

export default function AdminConsole() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'experience'>('messages');
  const [messages, setMessages] = useState<Message[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  
  // Form creations
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    tagsString: '',
    githubUrl: '',
    liveUrl: '',
  });

  const [newExperience, setNewExperience] = useState({
    role: '',
    company: '',
    period: '',
    description: '',
    location: '',
  });

  // Verify Session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await API.get('/auth/me');
        if (res.data && res.data.user) {
          setIsLoggedIn(true);
        }
      } catch (err) {
        setIsLoggedIn(false);
      }
    }
    checkSession();
  }, []);

  // Fetch Dashboard data
  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  async function fetchData() {
    try {
      const msgRes = await API.get('/messages');
      setMessages(msgRes.data);
      
      const projRes = await API.get('/projects');
      setProjects(projRes.data);
      
      const expRes = await API.get('/experiences');
      setExperiences(expRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setAuthError('Please fill in all fields.');
      return;
    }
    setLoading(true);
    setAuthError('');
    try {
      const res = await API.post('/auth/login', { username, password });
      if (res.status === 200) {
        setIsLoggedIn(true);
      }
    } catch (err: any) {
      if (!err.response) {
        setAuthError('Connection failed. Please ensure the backend Express server is running on port 5000.');
      } else {
        setAuthError(err.response?.data?.message || 'Invalid credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await API.post('/auth/logout');
      setIsLoggedIn(false);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Message Operations
  const handleMarkAsRead = async (id: number) => {
    try {
      await API.patch(`/messages/${id}`, { status: 'read' });
      setMessages(messages.map(m => m.id === id ? { ...m, status: 'read' } : m));
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    try {
      await API.delete(`/messages/${id}`);
      setMessages(messages.filter(m => m.id !== id));
    } catch (err) {
      alert('Error deleting message');
    }
  };

  // Project Operations
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    const tags = newProject.tagsString.split(',').map(t => t.trim()).filter(Boolean);
    try {
      const res = await API.post('/projects', {
        title: newProject.title,
        description: newProject.description,
        tags,
        githubUrl: newProject.githubUrl,
        liveUrl: newProject.liveUrl,
      });
      setProjects([...projects, res.data]);
      setNewProject({ title: '', description: '', tagsString: '', githubUrl: '', liveUrl: '' });
    } catch (err) {
      alert('Error creating project');
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await API.delete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
    } catch (err) {
      alert('Error deleting project');
    }
  };

  // Experience Operations
  const handleCreateExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/experiences', newExperience);
      setExperiences([...experiences, res.data]);
      setNewExperience({ role: '', company: '', period: '', description: '', location: '' });
    } catch (err) {
      alert('Error creating experience');
    }
  };

  const handleDeleteExperience = async (id: number) => {
    if (!confirm('Are you sure you want to delete this experience timeline item?')) return;
    try {
      await API.delete(`/experiences/${id}`);
      setExperiences(experiences.filter(e => e.id !== id));
    } catch (err) {
      alert('Error deleting experience');
    }
  };

  // Render Login Form
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF6EE] flex items-center justify-center p-6 relative overflow-hidden select-none">
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:24px_24px] pointer-events-none" />

        <div className="w-full max-w-md relative z-10">
          {/* Back button */}
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-black text-black border-2 border-black bg-white px-3 py-1.5 shadow-[2px_2px_0px_0px_#000] mb-8 hover:-translate-y-0.5 active:translate-y-0.5 transition-all">
            <ArrowLeft size={14} className="stroke-[3px]" /> Back to website
          </Link>

          {/* Card */}
          <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#000] rounded-none">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-black tracking-tight uppercase mb-2">
                Console Access
              </h1>
              <div className="inline-block bg-[#FFD000] text-black border-2 border-black font-mono font-black text-[10px] px-3 py-1 uppercase tracking-wider">
                SECURITY CLEARED ONLY
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {authError && (
                <div className="bg-[#FF5A36] text-white border-2 border-black text-xs font-bold p-3 shadow-[2px_2px_0px_0px_#000]">
                  {authError}
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-black stroke-[2.5px]" />
                  <input
                    type="text"
                    required
                    placeholder="Enter Admin username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-none pl-10 pr-4 py-3.5 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-black stroke-[2.5px]" />
                  <input
                    type="password"
                    required
                    placeholder="Enter Secure password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border-2 border-black rounded-none pl-10 pr-4 py-3.5 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full neo-button bg-[#FF5A36] text-white font-black py-4 uppercase text-sm border-3 border-black shadow-[4px_4px_0px_0px_#000]"
              >
                {loading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Render Admin Dashboard
  return (
    <div className="min-h-screen bg-[#FAF6EE] text-black flex flex-col select-none">
      {/* Top Header */}
      <header className="border-b-4 border-black bg-white py-5 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h1 className="font-extrabold text-2xl tracking-tight text-black border-2 border-black px-3 py-1 bg-[#FFD000]">
              CONSOLE<span className="text-[#FF5A36] font-bold">•</span>MGMT
            </h1>
            <Link href="/" className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-gray-700 hover:text-[#FF5A36] transition-colors">
              View Website <ArrowUpRight size={12} className="stroke-[3px]" />
            </Link>
          </div>

          <button
            onClick={handleLogout}
            className="neo-button bg-white text-black px-4 py-2 text-xs uppercase hover:bg-rose-500 hover:text-white"
          >
            Logout <LogOut size={14} className="ml-1.5 stroke-[2.5px]" />
          </button>
        </div>
      </header>

      {/* Main Console Body */}
      <div className="flex-grow max-w-7xl w-full mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="space-y-3">
          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-5 py-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] text-sm font-black uppercase tracking-wider transition-all ${
              activeTab === 'messages'
                ? 'bg-[#FF5A36] text-white translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:-translate-y-0.5 active:translate-y-0.5'
            }`}
          >
            <Mail size={16} className="stroke-[2.5px]" /> Messages ({messages.length})
          </button>

          <button
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-5 py-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] text-sm font-black uppercase tracking-wider transition-all ${
              activeTab === 'projects'
                ? 'bg-[#8B5CF6] text-white translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:-translate-y-0.5 active:translate-y-0.5'
            }`}
          >
            <Folder size={16} className="stroke-[2.5px]" /> Projects ({projects.length})
          </button>

          <button
            onClick={() => setActiveTab('experience')}
            className={`w-full flex items-center gap-3 px-5 py-4 border-3 border-black shadow-[4px_4px_0px_0px_#000] text-sm font-black uppercase tracking-wider transition-all ${
              activeTab === 'experience'
                ? 'bg-[#00E19F] text-black translate-x-[2px] translate-y-[2px] shadow-[2px_2px_0px_0px_#000]'
                : 'bg-white text-black hover:-translate-y-0.5 active:translate-y-0.5'
            }`}
          >
            <Calendar size={16} className="stroke-[2.5px]" /> Experience ({experiences.length})
          </button>
        </div>

        {/* Content Panel */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* TAB 1: Messages */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight text-black">Inbound Messages</h2>
              {messages.length === 0 ? (
                <div className="bg-white border-3 border-black p-12 text-center text-gray-500 font-mono text-sm shadow-[4px_4px_0px_0px_#000]">
                  No message submissions yet.
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg) => (
                    <div 
                      key={msg.id}
                      className={`bg-white border-3 border-black p-6 shadow-[6px_6px_0px_0px_#000] rounded-none transition-all ${
                        msg.status === 'unread' ? 'border-[#FF5A36]' : 'border-black'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                        <div>
                          <h4 className="font-extrabold text-lg text-black">{msg.name}</h4>
                          <a href={`mailto:${msg.email}`} className="text-xs text-[#FF5A36] font-mono font-black hover:underline">{msg.email}</a>
                        </div>
                        <div className="flex items-center gap-2">
                          {msg.status === 'unread' && (
                            <button
                              onClick={() => handleMarkAsRead(msg.id)}
                              className="neo-button p-2.5 bg-[#00E19F] text-black hover:bg-[#00c98f]"
                              title="Mark as Read"
                            >
                              <Check size={16} className="stroke-[3px]" />
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteMessage(msg.id)}
                            className="neo-button p-2.5 bg-rose-500 text-white hover:bg-rose-600"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="border-t-2 border-black pt-4">
                        <p className="text-xs text-black font-mono font-black uppercase tracking-wider mb-2">Subject: {msg.subject}</p>
                        <p className="text-sm text-black font-bold leading-relaxed">{msg.message}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-4">Submitted: {new Date(msg.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Projects */}
          {activeTab === 'projects' && (
            <div className="space-y-8">
              
              {/* Form creation */}
              <div className="bg-white border-3 border-black p-6 shadow-[6px_6px_0px_0px_#000] rounded-none">
                <h3 className="text-xl font-black text-black mb-6 uppercase tracking-wide flex items-center gap-2">
                  <Plus size={18} className="stroke-[3px]" /> Add New Project
                </h3>
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Project Title"
                      required
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      className="bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Tags (comma separated e.g. React, Node.js)"
                      required
                      value={newProject.tagsString}
                      onChange={(e) => setNewProject({ ...newProject, tagsString: e.target.value })}
                      className="bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    />
                  </div>

                  <textarea
                    placeholder="Project Description"
                    required
                    rows={4}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all resize-none"
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="url"
                      placeholder="GitHub Code URL"
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                      className="bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    />
                    <input
                      type="url"
                      placeholder="Live Demo URL"
                      value={newProject.liveUrl}
                      onChange={(e) => setNewProject({ ...newProject, liveUrl: e.target.value })}
                      className="bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full neo-button bg-[#8B5CF6] text-white font-black py-3 px-6 uppercase text-sm border-3 border-black shadow-[4px_4px_0px_0px_#000]"
                  >
                    Save Project
                  </button>
                </form>
              </div>

              {/* Projects List */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-black uppercase tracking-wide">Existing Projects</h3>
                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="flex items-center justify-between p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                      <div>
                        <h4 className="font-extrabold text-black uppercase">{proj.title}</h4>
                        <p className="text-xs text-gray-500 font-mono font-bold tracking-wider">{proj.tags.join(', ')}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="neo-button p-2.5 bg-rose-500 text-white hover:bg-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Experience */}
          {activeTab === 'experience' && (
            <div className="space-y-8">
              
              {/* Form creation */}
              <div className="bg-white border-3 border-black p-6 shadow-[6px_6px_0px_0px_#000] rounded-none">
                <h3 className="text-xl font-black text-black mb-6 uppercase tracking-wide flex items-center gap-2">
                  <Plus size={18} className="stroke-[3px]" /> Add Experience Milestone
                </h3>
                <form onSubmit={handleCreateExperience} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Role / Title"
                      required
                      value={newExperience.role}
                      onChange={(e) => setNewExperience({ ...newExperience, role: e.target.value })}
                      className="bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Company / Organizer"
                      required
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      className="bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Period (e.g. 2024 - Present)"
                      required
                      value={newExperience.period}
                      onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                      className="bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    />
                    <input
                      type="text"
                      placeholder="Location (e.g. Remote, Ranchi)"
                      value={newExperience.location}
                      onChange={(e) => setNewExperience({ ...newExperience, location: e.target.value })}
                      className="bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all"
                    />
                  </div>

                  <textarea
                    placeholder="Milestone Description"
                    required
                    rows={4}
                    value={newExperience.description}
                    onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
                    className="w-full bg-white border-2 border-black px-4 py-3 text-sm text-black font-bold shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-[1px_1px_0px_0px_#000] transition-all resize-none"
                  />

                  <button
                    type="submit"
                    className="w-full neo-button bg-[#00E19F] text-black font-black py-3 px-6 uppercase text-sm border-3 border-black shadow-[4px_4px_0px_0px_#000]"
                  >
                    Save Experience
                  </button>
                </form>
              </div>

              {/* Experience List */}
              <div className="space-y-4">
                <h3 className="text-xl font-black text-black uppercase tracking-wide">Existing Timeline</h3>
                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between p-4 bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000]">
                      <div>
                        <h4 className="font-extrabold text-black uppercase">{exp.role}</h4>
                        <p className="text-xs text-gray-500 font-mono font-bold tracking-wider">{exp.company} ({exp.period})</p>
                      </div>
                      <button
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="neo-button p-2.5 bg-rose-500 text-white hover:bg-rose-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
