import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, Info } from 'lucide-react';
import API from '../services/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const { data } = await API.get('/notifications');
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        className="btn-secondary"
        style={{ padding: '0.5rem', borderRadius: '50%', position: 'relative' }}
        title="Notifications"
      >
        <Bell size={20} color="#94a3b8" />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#f43f5e',
              color: 'white',
              fontSize: '0.65rem',
              fontWeight: '700',
              padding: '2px 6px',
              borderRadius: '999px'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="glass-card"
          style={{
            position: 'absolute',
            right: 0,
            top: '45px',
            width: '320px',
            maxHeight: '400px',
            overflowY: 'auto',
            zIndex: 100,
            padding: '1rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Notifications</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unreadCount} new</span>
          </div>

          {notifications.length === 0 ? (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem 0' }}>
              No notifications yet
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => !n.isRead && handleMarkRead(n._id)}
                  style={{
                    padding: '0.65rem',
                    borderRadius: '8px',
                    background: n.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(79, 70, 229, 0.1)',
                    border: n.isRead ? '1px solid var(--border)' : '1px solid var(--primary-light)',
                    cursor: n.isRead ? 'default' : 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <Info size={14} color={n.isRead ? '#94a3b8' : '#818cf8'} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: n.isRead ? 'var(--text-secondary)' : '#ffffff' }}>
                      {n.title}
                    </span>
                  </div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0 }}>{n.message}</p>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', marginTop: '0.25rem' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
