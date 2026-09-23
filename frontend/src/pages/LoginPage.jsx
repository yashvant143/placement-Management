import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, LogIn, AlertCircle, Sparkles } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.success) {
      if (res.role === 'admin') navigate('/admin/dashboard');
      else if (res.role === 'hr') navigate('/hr/dashboard');
      else navigate('/student/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleDemoLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const res = await login(demoEmail, demoPassword);
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
      <div className="glass-card" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem auto' }}>
            <GraduationCap size={30} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Welcome Back</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Log in to access your placement dashboard</p>
        </div>

        {error && (
          <div style={{ background: 'rgba(244,63,94,0.15)', border: '1px solid rgba(244,63,94,0.4)', padding: '0.75rem', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="name@college.edu or hr@company.com"
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : <><LogIn size={18} /> Sign In</>}
          </button>
        </form>

        {/* Quick Demo Access Bar */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--primary-light)', fontWeight: 700, marginBottom: '0.75rem' }}>
            <Sparkles size={16} /> 1-Click Demo Logins:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoLogin('student1@college.edu', 'student123')}
            >
              🎓 Student
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoLogin('hr@google.com', 'hr1234')}
            >
              🏢 HR
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoLogin('admin@placement.com', 'admin123')}
            >
              👨‍💼 TPO Admin
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '1.5rem' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Register now</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
