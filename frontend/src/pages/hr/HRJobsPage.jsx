import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Briefcase, Users, Plus, Trash2, Calendar, DollarSign, MapPin } from 'lucide-react';

const HRJobsPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanyAndJobs();
  }, []);

  const fetchCompanyAndJobs = async () => {
    try {
      const compRes = await API.get('/companies/profile');
      setCompany(compRes.data);
      if (compRes.data?._id) {
        const jobsRes = await API.get('/jobs', { params: { companyId: compRes.data._id } });
        setJobs(jobsRes.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this placement drive?')) return;
    try {
      await API.delete(`/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <div className="page-body">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Manage Placement Drives</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            View active company drives, check total applicant submissions, and manage shortlists.
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => navigate('/hr/jobs/create')}>
          <Plus size={18} /> Post New Placement Drive
        </button>
      </div>

      {loading ? (
        <div>Loading job drives...</div>
      ) : jobs.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          You have not posted any campus placement drives yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {jobs.map((job) => (
            <div key={job._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{job.title}</h3>
                  <button onClick={() => handleDeleteJob(job._id)} style={{ color: '#f87171', padding: '0.2rem' }} title="Delete Job">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>💵 {job.salary}</span>
                  <span>•</span>
                  <span>📍 {job.location}</span>
                  <span>•</span>
                  <span>🎓 Min CGPA: {job.minCGPA}</span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {job.description}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                  Allowed Branches: {job.allowedBranches?.join(', ')}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => navigate(`/hr/jobs/${job._id}/applicants`)}
                >
                  <Users size={16} /> View Applicants Matrix
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HRJobsPage;
