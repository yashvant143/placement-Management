import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Calendar, Video, ExternalLink } from 'lucide-react';

const AdminInterviewsPage = () => {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const { data } = await API.get('/interviews');
      setInterviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Master Campus Interview Schedule</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          All ongoing and upcoming technical / HR interview rounds scheduled across companies.
        </p>
      </div>

      {loading ? (
        <div>Loading interviews...</div>
      ) : interviews.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No interview rounds scheduled yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {interviews.map((item) => {
            const student = item.studentId || {};
            const company = item.companyId || {};
            const job = item.applicationId?.jobId || {};

            return (
              <div key={item._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <span className="badge badge-info">{item.round}</span>
                    <span className="badge badge-warning">{item.mode}</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.2rem' }}>
                    {company.name} ↔ {student.name}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Role: <strong>{job.title}</strong>
                  </p>

                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>📅 Date: <strong>{item.date}</strong> at <strong>{item.time}</strong></div>
                    <div>🎓 Student Email: <strong>{student.email}</strong></div>
                  </div>
                </div>

                {item.meetingLink && (
                  <a
                    href={item.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    <Video size={14} /> Open Meeting Link <ExternalLink size={12} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminInterviewsPage;
