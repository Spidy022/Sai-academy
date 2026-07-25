import React from 'react';

const StatCard = ({ title, value, icon, colorGradient, subtitle }) => {
  return (
    <div className="glass-card stat-card" style={{ '--card-color': colorGradient[0], '--card-color-end': colorGradient[1] }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-details">
        <h3 className="stat-value">{value}</h3>
        <p className="stat-title">{title}</p>
        {subtitle && <p className="stat-subtitle">{subtitle}</p>}
      </div>
      <div className="stat-glow"></div>
      <style>{`
        .stat-card {
          display: flex;
          align-items: center;
          gap: 20px;
          position: relative;
          overflow: hidden;
          padding: 28px;
        }
        .stat-icon {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--card-color) 0%, var(--card-color-end) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
          z-index: 2;
        }
        .stat-icon svg {
          width: 32px;
          height: 32px;
        }
        .stat-details {
          z-index: 2;
        }
        .stat-value {
          font-size: 2rem;
          margin-bottom: 4px;
        }
        .stat-title {
          font-weight: 600;
          color: var(--text-secondary);
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .stat-subtitle {
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 4px;
        }
        .stat-glow {
          position: absolute;
          top: -30px;
          right: -30px;
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--card-color) 0%, var(--card-color-end) 100%);
          filter: blur(50px);
          opacity: 0.25;
          z-index: 1;
        }
      `}</style>
    </div>
  );
};
export default StatCard;
