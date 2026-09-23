import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
import { Briefcase, ArrowLeft, PlusCircle } from 'lucide-react';

const CreateJobPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    skills: '',
    minCGPA: 6.5,
    passingYear: 2027,
    salary: '8.0 LPA',
    location: 'Bangalore / Hybrid',
    deadline: ''
  });

  const [allowedBranches, setAllowedBranches] = useState(['CSE', 'IT', 'CSE-AIML']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const branchesList = ['CSE', 'IT', 'CSE-AIML', 'ECE', 'EEE', 'MECH', 'CIVIL'];

  const handleBranchToggle = (branch) => {
    if (allowedBranches.includes(branch)) {
      setAllowedBranches(allowedBranches.filter(b => b !== branch));
    } else {
      setAllowedBranches([...allowedBranches, branch]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await API.post('/jobs', {
        ...formData,
        minCGPA: Number(formData.minCGPA),
        passingYear: Number(formData.passingYear),
        allowedBranches,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        deadline: formData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      });
      alert('Placement drive posted successfully! 🚀 All eligible students have been notified.');
      navigate('/hr/jobs');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post job drive');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body" style={{ maxWidth: '850px' }}>
      <button className="btn btn-secondary btn-sm" style={{ marginBottom: '1.5rem' }} onClick={() => navigate('/hr/jobs')}>
        <ArrowLeft size={16} /> Back to Drives
      </button>

      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create Placement Drive</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Define role details, package, and academic eligibility criteria.
        </p>
      </div>

      {error && (
        <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.4)', padding: '0.75rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
        <div className="input-group">
          <label className="input-label">Job Title</label>
          <input
            type="text"
            className="input-field"
            placeholder="e.g. Full-Stack MERN Developer"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label">Job Description & Responsibilities</label>
          <textarea
            className="input-field"
            rows={4}
            placeholder="Describe role responsibilities, team environment, and expectations..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Annual Package (CTC)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. 10.5 LPA"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Job Location</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Bangalore / Remote"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Minimum Required CGPA</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              className="input-field"
              value={formData.minCGPA}
              onChange={(e) => setFormData({ ...formData, minCGPA: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Target Passing Year</label>
            <input
              type="number"
              className="input-field"
              value={formData.passingYear}
              onChange={(e) => setFormData({ ...formData, passingYear: e.target.value })}
              required
            />
          </div>
        </div>

        {/* Branch Selection Checkboxes */}
        <div className="input-group" style={{ margin: '1rem 0' }}>
          <label className="input-label" style={{ marginBottom: '0.5rem' }}>Allowed Student Branches</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {branchesList.map((branch) => {
              const checked = allowedBranches.includes(branch);
              return (
                <button
                  key={branch}
                  type="button"
                  onClick={() => handleBranchToggle(branch)}
                  className={`btn btn-sm ${checked ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: '6px' }}
                >
                  {checked ? '✓ ' : '+ '}{branch}
                </button>
              );
            })}
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Required Skills (Comma Separated)</label>
          <input
            type="text"
            className="input-field"
            placeholder="React, Node.js, MongoDB, Java, AWS"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Application Deadline</label>
          <input
            type="date"
            className="input-field"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem' }} disabled={loading}>
          <PlusCircle size={18} /> {loading ? 'Publishing Drive...' : 'Publish Placement Drive'}
        </button>
      </form>
    </div>
  );
};

export default CreateJobPage;
