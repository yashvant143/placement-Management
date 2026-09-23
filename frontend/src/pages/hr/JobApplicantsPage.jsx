import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Users, FileText, CheckCircle, XCircle, Calendar, ArrowLeft, Filter } from 'lucide-react';

const JobApplicantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [minCgpaFilter, setMinCgpaFilter] = useState('');

  // Interview Schedule Modal state
  const [scheduleModalApp, setScheduleModalApp] = useState(null);
  const [interviewForm, setInterviewForm] = useState({
    date: '',
    time: '11:00 AM',
    mode: 'Online',
    meetingLink: '',
    round: 'Technical Interview Round 1',
    notes: ''
  });

  useEffect(() => {
    fetchJobAndApplicants();
  }, [id]);

  const fetchJobAndApplicants = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        API.get(`/jobs/${id}`),
        API.get('/applications', { params: { jobId: id } })
      ]);
      setJob(jobRes.data);
      setApplicants(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await API.put(`/applications/${appId}/status`, { status: newStatus });
      setApplicants(prev => prev.map(a => a._id === appId ? { ...a, status: newStatus } : a));
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    if (!scheduleModalApp) return;

    try {
      await API.post('/interviews', {
        applicationId: scheduleModalApp._id,
        ...interviewForm
      });
      alert('Interview scheduled successfully! Notification sent to candidate. 🗓️');
      setScheduleModalApp(null);
      fetchJobAndApplicants();
    } catch (err) {
      alert(err.response?.data?.message || 'Interview scheduling failed');
    }
  };

  const filteredApplicants = applicants.filter(app => {
    if (statusFilter && app.status !== statusFilter) return false;
    const cgpa = app.studentProfile?.cgpa || 0;
    if (minCgpaFilter && cgpa < Number(minCgpaFilter)) return false;
    return true;
  });

  if (loading) return <div className="page-body">Loading applicants...</div>;

  return (
    <div className="page-body">
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/hr/jobs')}>
        <ArrowLeft size={16} /> Back to Drives
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Applicants for: {job?.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            Package: {job?.salary} | Min CGPA required: {job?.minCGPA} | Total Applications: {applicants.length}
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Filter size={16} /> <span>Filters:</span>
        </div>

        <select className="input-field" style={{ width: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>

        <input
          type="number"
          step="0.1"
          placeholder="Min Candidate CGPA"
          className="input-field"
          style={{ width: '180px' }}
          value={minCgpaFilter}
          onChange={(e) => setMinCgpaFilter(e.target.value)}
        />
      </div>

      {/* Applicants Table */}
      {filteredApplicants.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No applicants matching the filter criteria.
        </div>
      ) : (
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Candidate Name</th>
                <th>Branch & CGPA</th>
                <th>10th / 12th %</th>
                <th>Skills & Resume</th>
                <th>Current Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplicants.map((app) => {
                const student = app.studentId || {};
                const profile = app.studentProfile || {};

                return (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email} | {student.phone}</div>
                    </td>
                    <td>
                      <div>Branch: <strong>{profile.branch || 'N/A'}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: profile.cgpa >= (job?.minCGPA || 0) ? '#34d399' : '#f87171' }}>
                        CGPA: <strong>{profile.cgpa || '0'}</strong>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '0.8rem' }}>10th: {profile.tenthPercentage || 'N/A'}%</div>
                      <div style={{ fontSize: '0.8rem' }}>12th: {profile.twelfthPercentage || 'N/A'}%</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.2rem', marginBottom: '0.35rem' }}>
                        {profile.skills?.slice(0, 3).map((s) => (
                          <span key={s} style={{ fontSize: '0.65rem', background: 'rgba(79,70,229,0.2)', color: '#818cf8', padding: '1px 5px', borderRadius: '4px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                      {profile.resumeUrl ? (
                        <a href={profile.resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'underline' }}>
                          📄 View Resume PDF
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No resume</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${app.status === 'Selected' ? 'badge-success' : app.status === 'Shortlisted' ? 'badge-warning' : app.status === 'Rejected' ? 'badge-danger' : 'badge-info'}`}>
                        {app.status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        {app.status === 'Applied' && (
                          <button className="btn btn-secondary btn-sm" onClick={() => handleStatusChange(app._id, 'Shortlisted')}>
                            Shortlist
                          </button>
                        )}
                        {(app.status === 'Shortlisted' || app.status === 'Interview') && (
                          <button className="btn btn-primary btn-sm" onClick={() => setScheduleModalApp(app)}>
                            <Calendar size={14} /> Schedule Interview
                          </button>
                        )}
                        {app.status !== 'Selected' && (
                          <button className="btn btn-primary btn-sm" style={{ background: '#10b981' }} onClick={() => handleStatusChange(app._id, 'Selected')}>
                            Select Candidate
                          </button>
                        )}
                        {app.status !== 'Rejected' && (
                          <button className="btn btn-danger btn-sm" onClick={() => handleStatusChange(app._id, 'Rejected')}>
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {scheduleModalApp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem' }}>
              Schedule Interview: {scheduleModalApp.studentId?.name}
            </h3>

            <form onSubmit={handleScheduleSubmit}>
              <div className="input-group">
                <label className="input-label">Round Title</label>
                <input
                  type="text"
                  className="input-field"
                  value={interviewForm.round}
                  onChange={(e) => setInterviewForm({ ...interviewForm, round: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="input-group">
                  <label className="input-label">Date</label>
                  <input
                    type="date"
                    className="input-field"
                    value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })}
                    required
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Time</label>
                  <input
                    type="text"
                    className="input-field"
                    placeholder="11:00 AM"
                    value={interviewForm.time}
                    onChange={(e) => setInterviewForm({ ...interviewForm, time: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Interview Mode</label>
                <select
                  className="input-field"
                  value={interviewForm.mode}
                  onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                >
                  <option value="Online">Online Video Call</option>
                  <option value="In-Person">In-Person Onsite</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Meeting Link / Location Room</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="https://meet.google.com/xyz or Room 402"
                  value={interviewForm.meetingLink}
                  onChange={(e) => setInterviewForm({ ...interviewForm, meetingLink: e.target.value })}
                />
              </div>

              <div className="input-group">
                <label className="input-label">Candidate Instructions</label>
                <textarea
                  className="input-field"
                  rows={2}
                  placeholder="e.g. Please bring hard copy of resume and keep IDE ready"
                  value={interviewForm.notes}
                  onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm & Schedule
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setScheduleModalApp(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobApplicantsPage;
