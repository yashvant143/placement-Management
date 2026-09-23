import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Building2, UserCheck, ShieldCheck, ArrowRight, Award, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: 'var(--text-primary)' }}>
      {/* Navbar */}
      <header style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '12px', display: 'flex' }}>
            <GraduationCap size={28} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800 }}>PlacementHub</h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Smart College Placement Portal</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/login" className="btn btn-secondary">Sign In</Link>
          <Link to="/register" className="btn btn-primary">Register Now <ArrowRight size={16} /></Link>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{ padding: '5rem 4rem 4rem 4rem', maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <div className="badge badge-info" style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem' }}>
          🚀 Next-Gen Automated Placement Management Engine
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1.5rem' }}>
          Connect <span className="title-gradient">Students, HR & TPO</span> <br /> On One Smart Platform
        </h1>

        <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '750px', margin: '0 auto 2.5rem auto' }}>
          Automate CGPA & Branch eligibility checks, manage campus drives, schedule technical interviews, and track live hiring metrics with detailed analytics.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '4rem' }}>
          <button className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={() => navigate('/login')}>
            Get Started <ChevronRight size={18} />
          </button>
          <button className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }} onClick={() => navigate('/login')}>
            Quick Demo Login
          </button>
        </div>

        {/* Feature Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ background: 'rgba(79,70,229,0.15)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
              <UserCheck size={28} color="#818cf8" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Smart Student Portal</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Complete student profile, PDF resume uploads, real-time eligibility scoring per job drive, and application pipelines.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ background: 'rgba(245,158,11,0.15)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
              <Building2 size={28} color="#fbbf24" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>HR Placement Drives</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Post placement drives, set minimum CGPA and allowed branch rules, review student profiles & schedule interview rounds.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ background: 'rgba(244,63,94,0.15)', padding: '0.75rem', borderRadius: '12px', width: 'fit-content', marginBottom: '1rem' }}>
              <ShieldCheck size={28} color="#f87171" />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>TPO Admin Control</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Comprehensive placement analytics, branch-wise selection charts, student management, and job drive monitoring.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
