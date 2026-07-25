import React, { useEffect } from 'react';
import { Menu, Moon, Sun, User, Bell } from 'lucide-react';
import { useAuth } from '../firebase/auth';

const Navbar = ({ toggleSidebar }) => {
  const { userProfile, isAdmin } = useAuth();
  const [theme, setTheme] = React.useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="navbar glass-card-no-hover">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} color="var(--text-primary)" />
        </button>
      </div>

      <div className="navbar-right">
        <button className="icon-btn" onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} color="var(--text-primary)" /> : <Moon size={20} color="var(--text-primary)" />}
        </button>
        <button className="icon-btn" style={{ position: 'relative' }}>
          <Bell size={20} color="var(--text-primary)" />
          <span className="notification-dot"></span>
        </button>
        
        <div className="user-profile-widget">
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
        }
      `}</style>
    </header>
  );
};

export default Navbar;
