import React from 'react';
import { Link } from 'react-router-dom';
import { Route, Award, Zap, ArrowRight, Cpu } from 'lucide-react';

const Landing = () => {
  return (
    <div className="landing-page" style={{ padding: '3.5rem 0' }}>
      <div className="container">
        {/* Hero Section */}
        <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 4rem auto' }}>
          <div className="badge badge-recommended" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem' }}>
            <Zap size={14} style={{ color: 'var(--gossamer-orange)' }} /> Full-Stack MERN Career Roadmap Engine
          </div>
          <h1 style={{ fontSize: '3.4rem', lineHeight: '1.15', marginBottom: '1.5rem' }}>
            Master Engineering Career Paths with <span style={{
              background: 'linear-gradient(135deg, #EC4D25 0%, #2BCFCE 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Prerequisite-Aware</span> Roadmaps
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>
            Stop wasting time on random tutorials. EngiPath analyzes your current skill gaps, enforces true topological prerequisite dependencies, plans your weekly study hours, and computes your placement-readiness score.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              Start Your Personalized Roadmap <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
              Demo Login
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid-3" style={{ marginBottom: '4rem' }}>
          <div className="glass-card">
            <Route size={36} style={{ color: 'var(--gossamer-orange)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Prerequisite Topology</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Hard rules ensure foundational skills come first. React is never recommended before JavaScript; JWT Auth comes strictly after Node & MongoDB.
            </p>
          </div>

          <div className="glass-card">
            <Award size={36} style={{ color: 'var(--gossamer-cyan)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Explainable Readiness Score</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Transparent mathematical scoring combining skill mastery (70%), quiz assessment scores (20%), and completed projects (10%).
            </p>
          </div>

          <div className="glass-card">
            <Cpu size={36} style={{ color: 'var(--gossamer-gray)', marginBottom: '1rem' }} />
            <h3 style={{ marginBottom: '0.5rem' }}>Adaptive Weekly Planner</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
              Enter your available study hours per week. EngiPath splits the roadmap into achievable weekly modules so you never burn out.
            </p>
          </div>
        </div>

        {/* Banner */}
        <div className="glass-card" style={{
          padding: '3.5rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(236, 77, 37, 0.05) 0%, rgba(43, 207, 206, 0.08) 100%)',
          borderColor: 'var(--border-light)'
        }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>Built Specifically for Modern Full-Stack MERN Engineers</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 2rem auto' }}>
            HTML/CSS &rarr; JS Fundamentals &rarr; React & Node.js &rarr; MongoDB & JWT Auth &rarr; MERN Capstone Project.
          </p>
          <Link to="/register" className="btn btn-emerald">
            Take Assessment & Generate Roadmap
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing;
