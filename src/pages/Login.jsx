import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../firebase/auth';
import { ShieldCheck, UserPlus, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password, name, phone);
      }
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box glass-card-no-hover">
        <div className="login-header">
          <div className="logo-icon-lg">S</div>
          <h2 className="page-title">Sai Police Academy</h2>
          <p className="subtitle">{isLogin ? 'Sign in to access your portal' : 'Create an account to join'}</p>
        </div>

        {error && (
          <div className="error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          {!isLogin && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Vikram Goutham" />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" className="form-input" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" />
              </div>
            </>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" className="form-input" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
            {loading ? <div className="spinner-sm"></div> : isLogin ? <><LogIn size={18} /> Sign In</> : <><UserPlus size={18} /> Create Account</>}
          </button>
        </form>

        <div className="toggle-mode">
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(""); }}>
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>

      <style>{`
        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--bg-primary);
          background-image: radial-gradient(circle at 15% 50%, rgba(139, 92, 246, 0.15), transparent 25%),
                            radial-gradient(circle at 85% 30%, rgba(59, 130, 246, 0.15), transparent 25%);
          padding: 20px;
        }
        .login-box {
          width: 100%;
          max-width: 440px;
          padding: 40px !important;
        }
        .login-header {
          text-align: center;
          margin-bottom: 32px;
        }
        .logo-icon-lg {
          width: 64px;
          height: 64px;
          border-radius: var(--radius-lg);
          background: var(--primary-gradient);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-size: 2.5rem;
          font-weight: 800;
          box-shadow: var(--shadow-glow);
          margin: 0 auto 20px auto;
        }
        .subtitle {
          color: var(--text-secondary);
          margin-top: 8px;
        }
        .error-alert {
          background: var(--danger-bg);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--danger);
          padding: 12px 16px;
          border-radius: var(--radius-sm);
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          font-size: 0.9rem;
          font-weight: 500;
        }
        .login-btn {
          width: 100%;
          padding: 14px;
          font-size: 1rem;
          margin-top: 12px;
        }
        .spinner-sm {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        .toggle-mode {
          margin-top: 24px;
          text-align: center;
        }
        .toggle-mode button {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .toggle-mode button:hover {
          color: var(--primary);
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default Login;
