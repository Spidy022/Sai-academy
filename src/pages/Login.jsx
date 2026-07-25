import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/auth';
import { Shield, ArrowRight, UserCircle, KeyRound, Loader, Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(async () => {
      try {
        await login(email, password);
        navigate('/dashboard');
      } catch (err) {
        console.error("Login failed:", err);
        alert("Login failed: " + err.message);
      } finally {
        setLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="login-page" style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      {/* Premium Animated Backgrounds */}
      <div className="premium-gradient-sweep"></div>
      <div className="premium-grid-bg"></div>
      
      <div className="login-centered-wrapper">
        <div className="login-glass-panel">
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
             <img src="/logo.png" className="logo-float" alt="Sai Police Academy" style={{ height: '80px', objectFit: 'contain' }} onError={(e) => { e.target.style.display='none'; }} />
          </div>
          
          <h1 style={{ fontSize: '2rem', marginBottom: '8px', color: 'var(--primary)' }}>Sai Police Academy</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', fontSize: '1rem', lineHeight: 1.5 }}>
            Access the student portal to view your syllabus, courses, and track fee payments.
          </p>

          <form onSubmit={handleLogin} style={{ textAlign: 'left' }}>
            <div className="form-group" style={{ marginBottom: '20px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCircle size={16} /> Reg Number or Email
              </label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter your registered ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '14px 16px', fontSize: '1rem' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '32px' }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <KeyRound size={16} /> Password
              </label>
              <div style={{ position: 'relative' }}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-input" 
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ padding: '14px 16px', fontSize: '1rem', paddingRight: '48px', width: '100%', boxSizing: 'border-box' }}
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
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-push" style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center' }} disabled={loading}>
              {loading ? (
                <><Loader size={20} className="spinner" style={{ borderWidth: '2px', width: '20px', height: '20px', marginRight: '8px' }} /> Authenticating...</>
              ) : (
                <>Secure Login <ArrowRight size={20} /></>
              )}
            </button>
          </form>
          
          <div style={{ marginTop: '32px', borderTop: '1px solid var(--border-glass)', paddingTop: '24px', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            <p style={{ marginBottom: '16px', textAlign: 'center' }}>Or click to quick-login:</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => {
                  setEmail('admin@test.com');
                  setPassword('password');
                }}
                style={{ flex: 1, padding: '10px' }}
              >
                Auto-fill Admin
              </button>
              <button 
                type="button"
                className="btn btn-secondary" 
                onClick={() => {
                  setEmail('student@test.com');
                  setPassword('password');
                }}
                style={{ flex: 1, padding: '10px' }}
              >
                Auto-fill Student
              </button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Login;
