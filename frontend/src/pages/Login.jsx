import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/auth';
import { Shield, ArrowRight, UserCircle, KeyRound, Loader, Eye, EyeOff, UserPlus, Phone } from 'lucide-react';

const Login = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' or 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (activeTab === 'login') {
        await login(email, password);
      } else {
        await register(email, password, name, phone, role);
      }
      navigate('/dashboard');
    } catch (err) {
      console.error("Auth process error:", err);
      alert((activeTab === 'login' ? "Login failed: " : "Registration failed: ") + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (demoRole) => {
    setLoading(true);
    const demoEmail = demoRole === 'admin' ? 'admin@test.com' : 'student@test.com';
    setEmail(demoEmail);
    setPassword('password');
    try {
      await login(demoEmail, 'password');
      navigate('/dashboard');
    } catch (err) {
      console.error("Demo login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      {/* Premium Animated Backgrounds */}
      <div className="premium-gradient-sweep"></div>
      <div className="premium-grid-bg"></div>
      
      <div className="login-centered-wrapper" style={{ width: '100%', maxWidth: '480px' }}>
        <div className="login-glass-panel" style={{ padding: '36px', borderRadius: '16px', background: 'var(--bg-card)', border: '1px solid var(--border-glass)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
             <img src="/logo.png" className="logo-float" alt="Sai Police Academy" style={{ height: '70px', objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; }} />
          </div>
          
          <h1 style={{ fontSize: '1.8rem', marginBottom: '6px', color: 'var(--primary)', textAlign: 'center' }}>Sai Police Academy</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', textAlign: 'center' }}>
            Official Academy Portal & Learning Management System
          </p>

          {/* Mode Switcher Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-secondary)', padding: '4px', borderRadius: '10px', marginBottom: '28px', border: '1px solid var(--border-glass)' }}>
            <button 
              type="button" 
              onClick={() => setActiveTab('login')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'login' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'login' ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Sign In
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('register')}
              style={{
                flex: 1,
                padding: '10px',
                border: 'none',
                borderRadius: '8px',
                background: activeTab === 'register' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'register' ? 'white' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} style={{ textAlign: 'left' }}>
            {activeTab === 'register' && (
              <>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <UserCircle size={16} /> Full Name
                  </label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    style={{ padding: '12px 14px', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '6px' }}>
                    <Phone size={16} /> Phone Number
                  </label>
                  <input 
                    type="tel" 
                    className="form-input" 
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ padding: '12px 14px', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' }}
                  />
                </div>
              </>
            )}

            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '6px' }}>
                <UserCircle size={16} /> Email Address
              </label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '12px 14px', fontSize: '0.95rem', width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: activeTab === 'register' ? '16px' : '24px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '6px' }}>
                <KeyRound size={16} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-input" 
                  placeholder="Enter secure password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ padding: '12px 14px', fontSize: '0.95rem', paddingRight: '44px', width: '100%', boxSizing: 'border-box' }}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px'
                  }}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {activeTab === 'register' && (
              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '6px' }}>
                  <Shield size={16} /> Select Account Role
                </label>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="student" 
                      checked={role === 'student'} 
                      onChange={() => setRole('student')} 
                    />
                    Student / Candidate
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <input 
                      type="radio" 
                      name="role" 
                      value="admin" 
                      checked={role === 'admin'} 
                      onChange={() => setRole('admin')} 
                    />
                    Academy Admin
                  </label>
                </div>
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-push" style={{ width: '100%', padding: '14px', fontSize: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }} disabled={loading}>
              {loading ? (
                <><Loader size={18} className="spinner" style={{ borderWidth: '2px', width: '18px', height: '18px' }} /> Processing...</>
              ) : activeTab === 'login' ? (
                <>Secure Login <ArrowRight size={18} /></>
              ) : (
                <>Register Account <UserPlus size={18} /></>
              )}
            </button>
          </form>
          
          <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '12px', textAlign: 'center', fontWeight: 600 }}>⚡ Instant Demo Login (1-Click Switcher):</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => handleQuickDemo('admin')}
                style={{ flex: 1, padding: '10px 8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Shield size={14} /> Admin Mode
              </button>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => handleQuickDemo('student')}
                style={{ flex: 1, padding: '10px 8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <UserCircle size={14} /> Student Mode
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
