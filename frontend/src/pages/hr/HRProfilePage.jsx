import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Building2, Save, CheckCircle, AlertCircle } from 'lucide-react';

const HRProfilePage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    website: '',
    location: '',
    description: '',
    industry: 'IT & Software'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get('/companies/profile');
      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        website: data.website || '',
        location: data.location || '',
        description: data.description || '',
        industry: data.industry || 'IT & Software'
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      await API.put('/companies/profile', formData);
      setMsg({ type: 'success', text: 'Company profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="page-body">Loading company profile...</div>;

  return (
    <div className="page-body" style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Company / HR Profile</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Update corporate details shown to campus students when browsing job drives.
        </p>
      </div>

      {msg.text && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: msg.type === 'success' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)',
          color: msg.type === 'success' ? '#34d399' : '#f87171',
          border: msg.type === 'success' ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(244,63,94,0.3)'
        }}>
          {msg.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div className="input-group">
            <label className="input-label">Company Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Google LLC"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Official HR Email</label>
            <input
              type="email"
              className="input-field"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">HR Contact Phone</label>
            <input
              type="text"
              className="input-field"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Company Website URL</label>
            <input
              type="text"
              className="input-field"
              placeholder="https://company.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Corporate Office Location</label>
            <input
              type="text"
              className="input-field"
              placeholder="Bangalore, India"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Industry Domain</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Fintech, Cloud & SaaS, E-Commerce"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            />
          </div>
        </div>

        <div className="input-group" style={{ marginTop: '0.5rem' }}>
          <label className="input-label">Company Overview / Description</label>
          <textarea
            className="input-field"
            rows={4}
            placeholder="Brief overview of company products, culture, and mission..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }} disabled={saving}>
          <Save size={18} /> {saving ? 'Saving...' : 'Save Company Profile'}
        </button>
      </form>
    </div>
  );
};

export default HRProfilePage;
