import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  User,
  Briefcase,
  FileCheck,
  Calendar,
  Building2,
  BarChart3,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role;

  const studentNav = [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', path: '/student/profile', icon: User },
    { name: 'Eligible Jobs', path: '/student/jobs', icon: Briefcase },
    { name: 'Applications', path: '/student/applications', icon: FileCheck },
    { name: 'Interviews', path: '/student/interviews', icon: Calendar }
  ];

  const hrNav = [
    { name: 'Dashboard', path: '/hr/dashboard', icon: LayoutDashboard },
    { name: 'Company Profile', path: '/hr/profile', icon: Building2 },
    { name: 'Post / Manage Jobs', path: '/hr/jobs', icon: Briefcase },
    { name: 'Interview Schedules', path: '/hr/interviews', icon: Calendar }
  ];

  const adminNav = [
    { name: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Students', path: '/admin/students', icon: GraduationCap },
    { name: 'Companies', path: '/admin/companies', icon: Building2 },
    { name: 'Placement Drives', path: '/admin/jobs', icon: Briefcase },
    { name: 'Applications', path: '/admin/applications', icon: FileCheck },
    { name: 'Interviews', path: '/admin/interviews', icon: Calendar },
    { name: 'Placement Analytics', path: '/admin/statistics', icon: BarChart3 }
  ];

  const navItems = role === 'admin' ? adminNav : role === 'hr' ? hrNav : studentNav;

  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0 0.5rem' }}>
        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px', display: 'flex' }}>
          <GraduationCap size={24} color="#ffffff" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>PlacementHub</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Smart Campus Portal</span>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `btn ${isActive ? 'btn-primary' : 'btn-secondary'}`
              }
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: '10px'
              }}
            >
              <Icon size={18} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 0.5rem', borderTop: '1px solid var(--border)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        Smart Placement System v1.0
      </div>
    </aside>
  );
};

export default Sidebar;
