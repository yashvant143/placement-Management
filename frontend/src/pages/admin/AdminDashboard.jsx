import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import StatCard from '../../components/StatCard';
import { Users, Building2, Briefcase, FileCheck, Award, BarChart3, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    summary: {},
    branchStats: [],
    funnelData: [],
    companyStats: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/statistics');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const summary = stats.summary || {};

  if (loading) return <div className="page-body">Loading Admin TPO Dashboard...</div>;

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span className="badge badge-danger" style={{ marginBottom: '0.5rem' }}>COLLEGE TPO ADMIN</span>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Master Placement Control Center</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Centralized monitoring of all student profiles, corporate recruiters, active job drives, and campus recruitment metrics.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/admin/statistics')}>
          <BarChart3 size={18} /> View Analytics Dashboard
        </button>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Students" value={summary.totalStudents || 0} icon={Users} color="#818cf8" subtitle="Registered candidates" />
        <StatCard title="Registered Companies" value={summary.totalCompanies || 0} icon={Building2} color="#fbbf24" subtitle="Corporate partners" />
        <StatCard title="Active Placement Drives" value={summary.totalJobs || 0} icon={Briefcase} color="#38bdf8" subtitle="Live placement drives" />
        <StatCard title="Total Applications" value={summary.totalApplications || 0} icon={FileCheck} color="#c084fc" subtitle="Submitted by students" />
        <StatCard title="Students Placed" value={summary.placedStudents || 0} icon={Award} color="#34d399" subtitle={`${summary.placementPercentage || 0}% Placement Rate`} />
      </div>

      {/* Quick Navigation Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/admin/students')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Student Database</h3>
            <ArrowRight size={18} color="var(--primary-light)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Filter students by CGPA, branch, technical skills, and placement status.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/admin/companies')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Company Partners</h3>
            <ArrowRight size={18} color="var(--primary-light)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Review registered recruiters, official HR contact emails, and active drives.
          </p>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => navigate('/admin/applications')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Application Pipeline</h3>
            <ArrowRight size={18} color="var(--primary-light)" />
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            Monitor student applications through Shortlist, Technical Interview, and Offer stages.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
