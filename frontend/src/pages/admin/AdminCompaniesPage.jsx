import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Building2, Globe, Mail, Phone, MapPin } from 'lucide-react';

const AdminCompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const { data } = await API.get('/admin/companies');
      setCompanies(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Corporate HR & Recruiters Directory</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          All verified companies and HR contacts registered on the campus placement platform.
        </p>
      </div>

      {loading ? (
        <div>Loading company records...</div>
      ) : companies.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No companies registered yet.
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {companies.map((comp) => {
            const hrUser = comp.userId || {};

            return (
              <div key={comp._id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
                    <div style={{ background: 'rgba(245,158,11,0.15)', padding: '0.5rem', borderRadius: '10px' }}>
                      <Building2 size={24} color="#fbbf24" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{comp.name}</h3>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{comp.industry || 'Tech & Software'}</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {comp.description || 'Corporate recruitment partner.'}
                  </p>

                  <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.85rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div>👤 HR Representative: <strong>{hrUser.name || 'HR Representative'}</strong></div>
                    <div>✉️ Email: <strong>{comp.email || hrUser.email}</strong></div>
                    <div>📞 Phone: <strong>{comp.phone || hrUser.phone || 'N/A'}</strong></div>
                    {comp.location && <div>📍 Location: <strong>{comp.location}</strong></div>}
                  </div>
                </div>

                {comp.website && (
                  <a
                    href={comp.website}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ width: '100%', marginTop: '1rem' }}
                  >
                    <Globe size={14} /> Visit Website
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

export default AdminCompaniesPage;
