import React, { useState } from 'react';
import { seedDemoData } from '../firebase/firestore';
import { Database, AlertTriangle, CheckCircle, Settings as SettingsIcon } from 'lucide-react';

const Settings = () => {
  const [seeding, setSeeding] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSeedData = async () => {
    if (window.confirm("Are you sure? This will generate test students, courses, and payments in your Firestore database. It is recommended only for empty/new projects to verify UI.")) {
      setSeeding(true);
      try {
        await seedDemoData();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } catch (err) {
        console.error("Error seeding data:", err);
        alert("Failed to seed data. Check console.");
      } finally {
        setSeeding(false);
      }
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Platform Settings</h1>
      </div>

      <div className="grid-cols-2">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <Database size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem' }}>Database Administration</h2>
          </div>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Manage your academy's database schema and configuration. 
          </p>

          <div style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--warning)', marginBottom: '12px', fontSize: '1rem' }}>
              <AlertTriangle size={18} /> Development Tools
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
              Populate empty Firestore collections with realistic demo data (Students, Courses, Materials) for UI evaluation.
            </p>
            <button 
              className="btn btn-secondary" 
              onClick={handleSeedData}
              disabled={seeding}
              style={{ width: '100%' }}
            >
              {seeding ? 'Generating Records...' : 'Seed Sample Database'}
            </button>
            {success && (
              <p style={{ color: 'var(--success)', marginTop: '12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle size={14} /> Data generated successfully!
              </p>
            )}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <SettingsIcon size={24} color="var(--primary)" />
            <h2 style={{ fontSize: '1.25rem' }}>Academy Preferences</h2>
          </div>
          <div className="form-group">
            <label className="form-label">Academy Name</label>
            <input type="text" className="form-input" defaultValue="Sai Police Academy" readOnly />
          </div>
          <div className="form-group">
            <label className="form-label">Support Email</label>
            <input type="text" className="form-input" defaultValue="support@saiacademy.edu.in" readOnly />
          </div>
          <button className="btn btn-primary">Save Preferences</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
