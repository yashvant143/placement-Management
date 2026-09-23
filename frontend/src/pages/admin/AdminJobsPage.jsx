import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import JobCard from '../../components/JobCard';

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data } = await API.get('/jobs');
      setJobs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Master Placement Drives</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          All campus placement drives created by registered recruiters.
        </p>
      </div>

      {loading ? (
        <div>Loading placement drives...</div>
      ) : jobs.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No active placement drives found.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.5rem' }}>
          {jobs.map((job) => (
            <JobCard
              key={job._id}
              job={job}
              userRole="admin"
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminJobsPage;
