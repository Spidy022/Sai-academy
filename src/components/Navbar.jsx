import React, { useState, useEffect } from 'react';
import { Menu, User, Bell } from 'lucide-react';
import { useAuth } from '../firebase/auth';

const Navbar = ({ toggleSidebar }) => {
  const { userProfile, isAdmin } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications && !event.target.closest('.notification-container')) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const [notifications, setNotifications] = useState([
    { id: 1, text: "New SI Course Video Published", time: "10m ago", read: false },
    { id: 2, text: "Fee Reminder: ₹2,800 Mess Fee Due", time: "2h ago", read: false },
    { id: 3, text: "PET Schedule Announced for Saturday", time: "1d ago", read: true }
  ]);

  const hasUnread = notifications.some(n => !n.read);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <header className="navbar glass-card-no-hover">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} color="var(--text-primary)" />
        </button>
      </div>

      <div className="navbar-right">
        
        <div className="notification-container" style={{ position: 'relative' }}>
          <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)} title="Notifications">
            <Bell size={20} color="var(--text-primary)" />
            {hasUnread && <span className="notification-dot"></span>}
          </button>
          
          {/* Notifications Dropdown Modal */}
          {showNotifications && (
            <div className="notifications-dropdown glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-glass)' }}>
                <h4 style={{ margin: 0 }}>Notifications</h4>
                <span onClick={markAllRead} style={{ fontSize: '0.75rem', color: 'var(--primary)', cursor: 'pointer' }}>Mark all read</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                {notifications.map(notif => (
                  <div key={notif.id} style={{ display: 'flex', gap: '12px', padding: '8px', background: notif.read ? 'transparent' : 'rgba(59, 130, 246, 0.05)', borderRadius: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: notif.read ? 'transparent' : 'var(--primary)', marginTop: '6px' }}></div>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{notif.text}</p>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <div className="user-profile-widget" style={{ cursor: 'pointer' }} onClick={() => window.location.href='/profile'}>
          <div className="avatar">
            <User size={20} color="white" />
          </div>
          <div className="user-info">
            <span className="user-name">{userProfile?.name || 'Loading...'}</span>
            <span className="user-role">{isAdmin() ? 'Administrator' : 'Student'}</span>
          </div>
        </div>
      </div>

      <style>{`
        .navbar {
          height: var(--header-height);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .navbar-left, .navbar-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .menu-btn {
          display: none;
        }
        .icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid var(--border-glass);
        }
        .icon-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        .notification-dot {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 8px;
          height: 8px;
          background: var(--danger);
          border-radius: 50%;
          box-shadow: 0 0 0 2px var(--bg-card);
        }
        .notifications-dropdown {
          position: absolute;
          top: 50px;
          right: 0;
          width: 320px;
          padding: 16px;
          z-index: 100;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
          border: 1px solid var(--border-glass);
        }
        .user-profile-widget {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: 16px;
          border-left: 1px solid var(--border-glass);
        }
        .avatar {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: var(--secondary-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 10px rgba(139, 92, 246, 0.3);
        }
        .user-info {
          display: flex;
          flex-direction: column;
        }
        .user-name {
          font-weight: 600;
          font-size: 0.95rem;
        }
        .user-role {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }
        @media (max-width: 992px) {
          .menu-btn { display: block; }
          .navbar { padding: 0 20px; }
          .user-info { display: none; }
          .notifications-dropdown { right: -50px; width: 280px; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
