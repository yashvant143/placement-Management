import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, UserPlus, AlertCircle } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('student');
  const [branch, setBranch] = useState('CSE');
  const [passingYear, setPassingYear] = useState(2027);
  const [error, setError] = useState('');

  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const res = await register({
      name,
      email,
      password,
      phone,
      role,
      branch,
      passingYear: Number(passingYear)
    });

    if (res.success) {
      if (res.role === 'admin') navigate('/admin/dashboard');
      else if (res.role === 'hr') navigate('/hr/dashboard');
      else navigate('/student/dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', padding: '1.5rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <GraduationCap size={30} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create an Account</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Register for Smart Placement System</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.4)', padding: '0.75rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Role selector */}
          <div className="input-group">
            <label className="input-label">Select Role</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn ${role === 'student' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('student')}
              >
                🎓 Student
              </button>
              <button
                type="button"
                className={`btn ${role === 'hr' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setRole('hr')}
              >
                🏢 HR / Recruiter
              </button>
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="name@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Phone Number</label>
            <input
              type="text"
              className="input-field"
              placeholder="+91 9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {role === 'student' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="input-group">
                <label className="input-label">Branch</label>
                <select className="input-field" value={branch} onChange={(e) => setBranch(e.target.value)}>
                  <option value="CSE">CSE</option>
                  <option value="IT">IT</option>
                  <option value="CSE-AIML">CSE-AIML</option>
                  <option value="ECE">ECE</option>
                  <option value="EEE">EEE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>

              <div className="input-group">
                <label className="input-label">Passing Year</label>
                <input
                  type="number"
                  className="input-field"
                  value={passingYear}
                  onChange={(e) => setPassingYear(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : <><UserPlus size={18} /> Register Now</>}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
          Already registered? <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
