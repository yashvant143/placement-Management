import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Building2, MapPin, DollarSign, Award, Calendar, CheckCircle2, XCircle, ArrowLeft } from 'lucide-react';

const JobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobDetails();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const [jobRes, appsRes] = await Promise.all([
        API.get(`/jobs/${id}`),
        API.get('/students/applications')
      ]);
      setJob(jobRes.data);
      const applied = appsRes.data.some(a => (a.jobId?._id || a.jobId) === id);
      setIsApplied(applied);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    try {
      await API.post('/applications', { jobId: id });
      setIsApplied(true);
      alert('Application submitted successfully! 🚀');
    } catch (err) {
      alert(err.response?.data?.message || 'Application failed');
    }
  };

  if (loading) return <div className="page-body">Loading job details...</div>;
  if (!job) return <div className="page-body">Job drive not found.</div>;

  const company = job.companyId || {};
  const eligibility = job.eligibility || { isEligible: true, reasons: [] };

  return (
    <div className="page-body" style={{ maxWidth: '900px' }}>
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={16} /> Back to Drives
      </button>

      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>{job.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <Building2 size={18} color="var(--primary-light)" />
              <span><strong>{company.name}</strong> ({company.industry || 'IT & Cloud'})</span>
            </div>
          </div>

          {eligibility.isEligible ? (
            <span className="badge badge-success" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <CheckCircle2 size={16} /> Eligible to Apply
            </span>
          ) : (
            <span className="badge badge-danger" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <XCircle size={16} /> Ineligible
            </span>
          )}
        </div>

        {/* Metrics Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', background: 'rgba(0,0,0,0.25)', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Salary Package</span>
            <strong style={{ fontSize: '1.1rem', color: '#34d399' }}>{job.salary}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Job Location</span>
            <strong style={{ fontSize: '1.1rem', color: '#38bdf8' }}>{job.location}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Minimum CGPA</span>
            <strong style={{ fontSize: '1.1rem', color: '#fbbf24' }}>{job.minCGPA}</strong>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>Target Batch</span>
            <strong style={{ fontSize: '1.1rem', color: '#c084fc' }}>{job.passingYear}</strong>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Role Description</h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
            {job.description}
          </p>
        </div>

        {/* Required Skills */}
        {job.skills && job.skills.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Required Tech Stack & Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {job.skills.map((s) => (
                <span key={s} style={{ padding: '0.35rem 0.85rem', background: 'rgba(79,70,229,0.15)', color: '#818cf8', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
                  {s}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Allowed Branches */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Eligible Academic Branches</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {job.allowedBranches?.map((b) => (
              <span key={b} style={{ padding: '0.35rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '0.85rem' }}>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Eligibility Status Warning Box */}
        {!eligibility.isEligible && (
          <div style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#f87171', fontWeight: 700, marginBottom: '0.35rem' }}>
              Why you are not eligible for this drive:
            </h4>
            <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#f87171' }}>
              {eligibility.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Button */}
        <button
          className={`btn ${isApplied ? 'btn-secondary' : eligibility.isEligible ? 'btn-primary' : 'btn-secondary'}`}
          style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}
          disabled={isApplied || !eligibility.isEligible}
          onClick={handleApply}
        >
          {isApplied ? 'Already Applied ✓' : eligibility.isEligible ? 'Submit Application Now' : 'Ineligible to Apply'}
        </button>
      </div>
    </div>
  );
};

export default JobDetailsPage;
