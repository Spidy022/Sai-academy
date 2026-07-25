import React, { useState, useEffect } from 'react';
import { useAuth } from '../firebase/auth';
import { db } from '../firebase/config';
import { doc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User, Mail, Shield, CheckCircle } from 'lucide-react';

const MyProfile = () => {
  const { currentUser, userProfile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({ name: userProfile.name || '', phone: userProfile.phone || '' });
    }
  }, [userProfile]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      // 1. Log the update request for Admin review
      await addDoc(collection(db, 'profile_updates'), {
        uid: currentUser.uid,
        email: userProfile.email,
        oldName: userProfile.name,
        newName: formData.name,
        oldPhone: userProfile.phone,
        newPhone: formData.phone,
        status: 'PENDING_REVIEW',
        timestamp: serverTimestamp()
      });

      // 2. Immediately apply update to user profile
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        name: formData.name,
        phone: formData.phone,
        updatedAt: serverTimestamp()
      });

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (!userProfile) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">My Profile Settings</h1>
      </div>

      <div className="glass-card" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <User size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem' }}>{userProfile.email}</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Shield size={14} /> {userProfile.role.toUpperCase()} ACCOUNT
            </p>
          </div>
        </div>

        {success && (
          <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            Profile updated! An administrator has been notified of these changes.
          </div>
        )}

        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input 
              type="text" 
              className="form-input" 
              required 
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number (Optional)</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.phone} 
              onChange={e => setFormData({...formData, phone: e.target.value})} 
            />
          </div>
          <div className="form-group">
            <label className="form-label">Registered Email</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Mail size={18} color="var(--text-muted)" />
              <input type="email" className="form-input" value={userProfile.email} disabled />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving Changes...' : 'Update Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
