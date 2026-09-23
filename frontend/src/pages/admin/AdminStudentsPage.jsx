import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import { Users, Search, Filter, Award, CheckCircle, FileText } from 'lucide-react';

const AdminStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('');
  const [minCgpa, setMinCgpa] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await API.get('/admin/students');
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    const p = student.profile || {};
    if (search) {
      const query = search.toLowerCase();
      const matchName = student.name?.toLowerCase().includes(query);
      const matchEmail = student.email?.toLowerCase().includes(query);
      if (!matchName && !matchEmail) return false;
    }
    if (branchFilter && p.branch !== branchFilter) return false;
    if (minCgpa && (p.cgpa || 0) < Number(minCgpa)) return false;
    if (statusFilter && (p.placementStatus || 'Unplaced') !== statusFilter) return false;
    return true;
  });

  return (
    <div className="page-body">
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Student Master Directory</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Comprehensive list of all student accounts, academic scores, skills, and placement status.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="input-field"
            style={{ paddingLeft: '2.4rem' }}
            placeholder="Search by student name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="input-field" style={{ width: '150px' }} value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)}>
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="IT">IT</option>
          <option value="CSE-AIML">CSE-AIML</option>
          <option value="ECE">ECE</option>
          <option value="EEE">EEE</option>
          <option value="MECH">MECH</option>
        </select>

        <input
          type="number"
          step="0.1"
          placeholder="Min CGPA"
          className="input-field"
          style={{ width: '140px' }}
          value={minCgpa}
          onChange={(e) => setMinCgpa(e.target.value)}
        />

        <select className="input-field" style={{ width: '160px' }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Placed">Placed 🎉</option>
          <option value="Unplaced">Unplaced</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div>Loading student records...</div>
      ) : filteredStudents.length === 0 ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No students match the selected filter criteria.
        </div>
      ) : (
        <div className="custom-table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Info</th>
                <th>Branch & Batch</th>
                <th>CGPA & Scores</th>
                <th>Skills & Resume</th>
                <th>Placement Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((st) => {
                const p = st.profile || {};
                const isPlaced = p.placementStatus === 'Placed';

                return (
                  <tr key={st._id}>
                    <td>
                      <div style={{ fontWeight: 700 }}>{st.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{st.email} | {st.phone}</div>
                    </td>
                    <td>
                      <div>Branch: <strong>{p.branch || 'N/A'}</strong></div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Batch: {p.passingYear || 2027}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: (p.cgpa || 0) >= 7.0 ? '#34d399' : '#fbbf24' }}>
                        CGPA: {p.cgpa || 0}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        10th: {p.tenthPercentage || 0}% | 12th: {p.twelfthPercentage || 0}%
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '0.25rem' }}>
                        {p.skills?.slice(0, 4).map((s) => (
                          <span key={s} style={{ fontSize: '0.65rem', background: 'rgba(79,70,229,0.15)', color: '#818cf8', padding: '1px 5px', borderRadius: '4px' }}>
                            {s}
                          </span>
                        ))}
                      </div>
                      {p.resumeUrl ? (
                        <a href={p.resumeUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'underline' }}>
                          📄 Resume PDF
                        </a>
                      ) : (
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No resume</span>
                      )}
                    </td>
                    <td>
                      {isPlaced ? (
                        <span className="badge badge-success"><CheckCircle size={14} /> PLACED</span>
                      ) : (
                        <span className="badge badge-warning">UNPLACED</span>
                      )}
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

export default AdminStudentsPage;
