import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Building2, Calendar, FileText, CheckCircle, Clock, XCircle, Award } from 'lucide-react';

const ApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/students/applications');
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Selected':
        return <span className="badge badge-success"><CheckCircle size={14} /> SELECTED 🎉</span>;
      case 'Interview':
        return <span className="badge badge-info"><Calendar size={14} /> INTERVIEW SCHEDULED</span>;
      case 'Shortlisted':
        return <span className="badge badge-warning"><Award size={14} /> SHORTLISTED</span>;
      case 'Rejected':
        return <span className="badge badge-danger"><XCircle size={14} /> REJECTED</span>;
      default:
        return <span className="badge badge-info"><Clock size={14} /> APPLIED</span>;
    }
  };

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>My Job Applications</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Track the live recruitment status of all campus placement applications you have submitted.
        </p>
      </div>

      {loading ? (
        <div>Loading your applications...</div>
      ) : applications.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          You haven't submitted any job applications yet. Go to <strong>Eligible Jobs</strong> to apply!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {applications.map((app) => {
            const job = app.jobId || {};
            const company = app.companyId || job.companyId || {};

            return (
              <div key={app._id} className="glass-card" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{job.title || 'Placement Drive'}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                      <Building2 size={16} color="var(--primary-light)" />
                      <span>{company.name || 'Company'}</span>
                      <span>•</span>
                      <span>Package: <strong>{job.salary || 'N/A'}</strong></span>
                      <span>•</span>
                      <span>Applied on: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div>
                    {getStatusBadge(app.status)}
                  </div>
                </div>

                {/* Progress Stepper Visualizer */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem' }}>
                  {['Applied', 'Shortlisted', 'Interview', 'Selected'].map((step, idx) => {
                    const statusOrder = ['Applied', 'Shortlisted', 'Interview', 'Selected'];
                    const currentIdx = statusOrder.indexOf(app.status);
                    const isCompleted = currentIdx >= idx;
                    const isCurrent = app.status === step;

                    return (
                      <React.Fragment key={step}>
                        <div style={{
                          padding: '0.35rem 0.75rem',
                          borderRadius: '6px',
                          background: isCurrent ? 'var(--primary)' : isCompleted ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.03)',
                          color: isCurrent ? '#ffffff' : isCompleted ? '#34d399' : 'var(--text-muted)',
                          fontWeight: isCurrent || isCompleted ? 700 : 400,
                          border: isCurrent ? '1px solid var(--primary-light)' : '1px solid var(--border)'
                        }}>
                          {step}
                        </div>
                        {idx < 3 && <div style={{ flex: 1, height: '2px', background: isCompleted ? '#34d399' : 'var(--border)' }} />}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ApplicationsPage;
