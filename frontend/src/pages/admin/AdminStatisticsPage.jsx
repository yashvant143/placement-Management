import React, { useState, useEffect } from 'react';
import API from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';
import StatCard from '../../components/StatCard';
import { Users, Award, BarChart3, TrendingUp, Percent } from 'lucide-react';

const AdminStatisticsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/admin/statistics');
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="page-body">Loading Placement Analytics...</div>;

  const summary = stats?.summary || {};
  const branchData = stats?.branchStats || [];
  const funnelData = stats?.funnelData || [];
  const companyData = stats?.companyStats || [];

  const pieData = [
    { name: 'Placed Students', value: summary.placedStudents || 0, color: '#10b981' },
    { name: 'Unplaced Students', value: summary.unplacedStudents || 0, color: '#f59e0b' }
  ];

  return (
    <div className="page-body">
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Campus Placement Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
          Interactive visualizations for branch performance, recruitment funnel, and recruiter statistics.
        </p>
      </div>

      <div className="stats-grid">
        <StatCard title="Total Students Registered" value={summary.totalStudents || 0} icon={Users} color="#818cf8" />
        <StatCard title="Overall Placements" value={summary.placedStudents || 0} icon={Award} color="#10b981" />
        <StatCard title="Placement Success Rate" value={`${summary.placementPercentage || 0}%`} icon={Percent} color="#fbbf24" />
        <StatCard title="Active Drives" value={summary.totalJobs || 0} icon={TrendingUp} color="#38bdf8" />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Branch-wise Placements Bar Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Branch-wise Placement Stats</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={branchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="branch" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                <Legend />
                <Bar dataKey="total" name="Total Students" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" name="Placed Students" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Placed vs Unplaced Pie Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Placed vs Unplaced Ratio</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Application Funnel Chart */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Recruitment Funnel Progress</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <AreaChart data={funnelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="stage" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="count" name="Candidates" stroke="#818cf8" fill="rgba(129, 140, 248, 0.3)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Company-wise Selections */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Company-wise Selections</h3>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={companyData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis type="number" stroke="#94a3b8" />
                <YAxis dataKey="company" type="category" stroke="#94a3b8" width={100} />
                <Tooltip contentStyle={{ background: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }} />
                <Bar dataKey="selections" name="Selected Candidates" fill="#fbbf24" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStatisticsPage;
