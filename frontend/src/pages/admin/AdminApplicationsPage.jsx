import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Filter, Building2, User } from 'lucide-react';

const AdminApplicationsPage = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await API.get('/applications');
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter(app => {
    if (statusFilter && app.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Master Applications Pipeline</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Real-time view of all student applications, shortlists, and final selections.
        </p>
      </div>

      {/* Filter */}
      <div className="glass-card" style={{ padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          <Filter size={16} /> <span>Status Filter:</span>
        </div>
        <select className="input-field" style={{ width: '180px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {loading ? (
        <div>Loading applications...</div>
      ) : filteredApps.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No applications matching filter criteria.
        </div>
      ) : (
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Candidate</th>
                <th>Company & Role</th>
                <th>Branch & CGPA</th>
                <th>Applied Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => {
                const student = app.studentId || {};
                const profile = app.studentProfile || {};
                const job = app.jobId || {};
                const company = app.companyId || job.companyId || {};

                return (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700 }}>{job.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{company.name} ({job.salary})</div>
                    </td>
                    <td>
                      <div>Branch: <strong>{profile.branch || 'N/A'}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>CGPA: {profile.cgpa || 'N/A'}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </td>
                    <td>
                      <span className={`badge ${app.status === 'Selected' ? 'badge-success' : app.status === 'Shortlisted' ? 'badge-warning' : app.status === 'Rejected' ? 'badge-danger' : 'badge-info'}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminApplicationsPage;
