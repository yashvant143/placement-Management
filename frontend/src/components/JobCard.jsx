import React from 'react';
import { Building2, MapPin, DollarSign, Award, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, onApply, isApplied, userRole }) => {
  const navigate = useNavigate();
  const company = job.companyId || {};
  const eligibility = job.eligibility || { isEligible: true, reasons: [] };

  return (
    <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>{job.title}</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>
              <Building2 size={16} color="var(--primary-light)" />
              <span>{company.name || 'Leading Enterprise'}</span>
            </div>
          </div>

          {userRole === 'student' && (
            eligibility.isEligible ? (
              <span className="badge badge-success">
                <CheckCircle2 size={12} /> Eligible
              </span>
            ) : (
              <span className="badge badge-danger">
                <XCircle size={12} /> Not Eligible
              </span>
            )
          )}
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>

        {/* Criteria Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <DollarSign size={14} color="#34d399" />
            <span>Package: <strong>{job.salary}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} color="#38bdf8" />
            <span>Location: <strong>{job.location}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Award size={14} color="#fbbf24" />
            <span>Min CGPA: <strong>{job.minCGPA}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} color="#c084fc" />
            <span>Batch: <strong>{job.passingYear}</strong></span>
          </div>
        </div>

        {/* Allowed Branches */}
        {job.allowedBranches && job.allowedBranches.length > 0 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.25rem' }}>Allowed Branches:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {job.allowedBranches.map((b) => (
                <span key={b} style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: '1px solid var(--border)' }}>
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '1rem' }}>
            {job.skills.map((skill) => (
              <span key={skill} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', background: 'rgba(79,70,229,0.15)', color: '#818cf8', borderRadius: '6px' }}>
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Ineligibility Warning if student */}
        {userRole === 'student' && !eligibility.isEligible && eligibility.reasons.length > 0 && (
          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244,63,94,0.3)', padding: '0.5rem 0.75rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#f87171', margin: 0 }}>
              ⚠️ {eligibility.reasons[0]}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
        <button
          className="btn btn-secondary btn-sm"
          style={{ flex: 1 }}
          onClick={() => navigate(`/student/jobs/${job._id}`)}
        >
          View Details
        </button>

        {userRole === 'student' && (
          <button
            className={`btn btn-sm ${isApplied ? 'btn-secondary' : eligibility.isEligible ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flex: 1 }}
            disabled={isApplied || !eligibility.isEligible}
            onClick={() => onApply && onApply(job._id)}
          >
            {isApplied ? 'Applied ✓' : eligibility.isEligible ? 'Apply Now' : 'Ineligible'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JobCard;
