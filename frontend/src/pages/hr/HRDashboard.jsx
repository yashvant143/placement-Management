import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import StatCard from '../../components/StatCard';
import { Briefcase, Users, UserCheck, Award, Calendar, Plus, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HRDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalApplicants: 0,
    shortlisted: 0,
    selected: 0,
    interviewsScheduled: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/companies/dashboard');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-body">Loading HR Portal...</div>;

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-warning" style={{ marginBottom: '0.5rem' }}>HR / RECRUITER PORTAL</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Company Placement Overview</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Manage your corporate placement drives, review student applications, and conduct interview rounds.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/hr/jobs/create')}>
          <Plus size={18} /> Post New Placement Drive
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Active Placement Drives" value={stats.totalJobs} icon={Briefcase} color="#818cf8" subtitle="Jobs posted on portal" />
        <StatCard title="Total Student Applicants" value={stats.totalApplicants} icon={Users} color="#38bdf8" subtitle="Received applications" />
        <StatCard title="Shortlisted Candidates" value={stats.shortlisted} icon={UserCheck} color="#fbbf24" subtitle="Moved to interview round" />
        <StatCard title="Final Selections" value={stats.selected} icon={Award} color="#34d399" subtitle="Offer letters extended" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Recruitment Quick Actions</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Easily manage candidates and schedule technical rounds.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="btn btn-secondary" style={{ justifyContent: 'space-between' }} onClick={() => navigate('/hr/jobs')}>
              <span>View Active Drives & Applicants</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'space-between' }} onClick={() => navigate('/hr/interviews')}>
              <span>Manage Scheduled Interviews ({stats.interviewsScheduled})</span>
              <ArrowRight size={16} />
            </button>
            <button className="btn btn-secondary" style={{ justifyContent: 'space-between' }} onClick={() => navigate('/hr/profile')}>
              <span>Update Corporate Profile</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ background: 'rgba(79,70,229,0.15)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <Plus size={30} color="#818cf8" />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.35rem' }}>Hiring for New Roles?</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            Define eligibility rules (Min CGPA, Allowed branches) and reach 500+ student candidates instantly.
          </p>
          <button className="btn btn-primary" style={{ width: 'fit-content', margin: '0 auto' }} onClick={() => navigate('/hr/jobs/create')}>
            Create Placement Drive
          </button>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
