import React from 'react';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const getRoleBadge = (role) => {
    if (role === 'admin') return <span className="badge badge-danger">ADMIN / TPO</span>;
    if (role === 'hr') return <span className="badge badge-warning">HR / COMPANY</span>;
    return <span className="badge badge-info">STUDENT</span>;
  };

  return (
    <header className="header">
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>
          Welcome back, <span className="title-gradient">{user?.name}</span>
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {getRoleBadge(user?.role)}
        <NotificationBell />
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderLeft: '1px solid var(--border)', paddingLeft: '1rem' }}>
          <button
            className="btn-secondary btn-sm"
            onClick={logout}
            title="Logout"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
