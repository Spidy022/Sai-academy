import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../firebase/auth';
import { 
  LayoutDashboard, Users, CreditCard, ClipboardCheck, 
  BookOpen, Bell, Settings, LogOut, Menu, X, MonitorPlay,
  Lock, Unlock, Link as LinkIcon, FileText, Database
} from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { userProfile, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // Restructured Tabs per Phase 2 requirements
  const navItems = [
    { name: 'Banner / Home', path: '/', icon: <LayoutDashboard size={20} />, adminOnly: false },
    { name: 'Free Courses', path: '/free-courses', icon: <Unlock size={20} />, adminOnly: false },
    { name: 'Paid Courses', path: '/premium-courses', icon: <Lock size={20} />, adminOnly: false },
    { name: 'Links', path: '/links', icon: <LinkIcon size={20} />, adminOnly: false },
    { name: 'E-books', path: '/ebooks', icon: <BookOpen size={20} />, adminOnly: false },
    { name: 'Syllabus', path: '/syllabus', icon: <FileText size={20} />, adminOnly: false },
    { name: 'Question Bank', path: '/question-bank', icon: <Database size={20} />, adminOnly: false },
    
    // Admin & Operational tools
    { name: 'Students', path: '/students', icon: <Users size={20} />, adminOnly: true },
    { name: 'Fees & Payments', path: '/payments', icon: <CreditCard size={20} />, adminOnly: false },
    { name: 'Attendance', path: '/attendance', icon: <ClipboardCheck size={20} />, adminOnly: true },
    { name: 'Settings & Admin', path: '/settings', icon: <Settings size={20} />, adminOnly: true }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="url(#academy-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <defs>
                  <linearGradient id="academy-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/>
                <path d="m8 11 4-2 4 2"/>
                <path d="m8 15 4-2 4 2"/>
              </svg>
            </div>
            <div>
              <h2>Sai Academy</h2>
              <span className="badge badge-admin" style={{ fontSize: '10px', padding: '2px 8px' }}>
                {isAdmin() ? 'Administrator' : (userProfile?.premiumAccess ? 'Premium Student' : 'Guest')}
              </span>
            </div>
          </div>
          <button className="mobile-close" onClick={toggleSidebar}>
            <X size={24} color="var(--text-primary)" />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            {navItems.map((item, idx) => {
              if (item.adminOnly && !isAdmin()) return null;
              
              const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
              return (
                <li key={idx}>
                  <NavLink to={item.path} onClick={() => { if(window.innerWidth <= 992) toggleSidebar(); }} className={`nav-link ${isActive ? 'active' : ''}`}>
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--bg-card);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-right: 1px solid var(--border-glass);
          display: flex;
          flex-direction: column;
          z-index: 100;
          transition: transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .sidebar-header {
          padding: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-glass);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .logo-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .logo h2 {
          font-size: 1.25rem;
          margin-bottom: 2px;
        }
        .sidebar-nav {
          flex: 1;
          padding: 24px 16px;
          overflow-y: auto;
        }
        .sidebar-nav ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px 16px;
          color: var(--text-secondary);
          border-radius: var(--radius-md);
          font-weight: 500;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        .nav-link:hover {
          color: var(--text-primary);
          background: rgba(255, 255, 255, 0.05);
        }
        .nav-link.active {
          color: white;
          background: var(--primary);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
        }
        .sidebar-footer {
          padding: 24px;
          border-top: 1px solid var(--border-glass);
        }
        .logout-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          padding: 12px;
          color: var(--danger);
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: var(--radius-sm);
        }
        .logout-btn:hover {
          background: var(--danger-bg);
        }
        .mobile-close { display: none; }
        .sidebar-overlay {
          display: none;
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 90;
        }

        @media (max-width: 992px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
          .mobile-close { display: block; }
          .sidebar-overlay { display: block; }
        }
      `}</style>
    </>
  );
};

export default Sidebar;
