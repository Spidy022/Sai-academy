import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Award, Users, ArrowRight, Shield } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll animations are now handled globally in App.jsx
  }, []);

  return (
    <div className="landing-page" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Premium Animated Backgrounds */}
      <div className="premium-gradient-sweep"></div>
      <div className="premium-grid-bg"></div>
      
      {/* Navigation Header */}
      <header className="landing-header">
        <div className="container header-container">
          <div className="logo-container">
            <img src="/logo.png" alt="Sai Police Academy" className="landing-logo" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
            <h2 style={{ display: 'none', margin: 0 }} className="fallback-logo-text">Sai Academy</h2>
          </div>
          <nav className="landing-nav">
            <a href="#about">About Us</a>
            <a href="#courses">Courses</a>
            <a href="#contact">Contact</a>
            <button className="btn btn-primary login-btn" onClick={() => navigate('/login')}>
              Student Portal <ArrowRight size={18} />
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background"></div>
        <div className="container hero-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '40px' }}>
          
          {/* Left: Text */}
          <div style={{ flex: 1, textAlign: 'left' }}>
            <h1 className="hero-title animate-on-scroll fade-up" style={{ fontSize: '4.5rem', marginBottom: '20px', lineHeight: 1.1 }}>
              <span className="text-highlight">Sai Police</span><br /> Academy
            </h1>
            <p className="hero-subtitle animate-on-scroll fade-up delay-1" style={{ fontSize: '1.4rem', maxWidth: '600px', marginBottom: '40px' }}>
              Empowering the next generation of law enforcement professionals with world-class training, expert guidance, and proven methodologies.
            </p>
            <div className="hero-actions animate-on-scroll fade-up delay-2" style={{ justifyContent: 'flex-start' }}>
              <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')} style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
                Join the Academy
              </button>
              <button className="btn btn-secondary btn-lg" onClick={() => document.getElementById('courses').scrollIntoView({ behavior: 'smooth' })} style={{ fontSize: '1.1rem', padding: '16px 32px' }}>
                View Courses
              </button>
            </div>
          </div>

          {/* Right: Floating Logo Graphic */}
          <div className="hero-graphic animate-on-scroll fade-in delay-1" style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div className="floating-container">
              <div className="glow-orb"></div>
              <img src="/logo.png" alt="Sai Police Academy" className="floating-logo" onError={(e) => { e.target.style.display='none'; }} />
            </div>
          </div>
          
        </div>
      </section>

      {/* Courses Section (NEW) */}
      <section id="courses" className="courses-section section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div className="section-heading animate-on-scroll fade-up">
            <h2>Our Premium Courses</h2>
            <p>Strictly structured programs designed to guarantee your success in the police examinations.</p>
          </div>
          
          <div className="features-grid" style={{ maxWidth: '900px', margin: '0 auto' }}>
            {/* PC Course */}
            <div className="feature-card animate-on-scroll slide-up" style={{ textAlign: 'center', padding: '40px' }}>
              <div className="feature-icon" style={{ margin: '0 auto 20px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}><Shield size={40} /></div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Police Constable (PC)</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Complete preparation for direct recruitment examinations, focusing on local penal codes and aptitude.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '24px' }}>₹7,000</div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '32px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>✓ Full Syllabus Coverage</li>
                <li>✓ E-Books & Study Material</li>
                <li>✓ Daily Mock Tests</li>
                <li>✓ Optional Mess Facility (₹2,800/mo)</li>
              </ul>
              <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => navigate('/login')}>Enroll Now</button>
            </div>

            {/* SI Course */}
            <div className="feature-card animate-on-scroll slide-up delay-1" style={{ textAlign: 'center', padding: '40px', border: '2px solid var(--primary)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-15px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 700 }}>MOST POPULAR</div>
              <div className="feature-icon" style={{ margin: '0 auto 20px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}><Award size={40} /></div>
              <h3 style={{ fontSize: '1.8rem', marginBottom: '16px' }}>Sub Inspector (SI)</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Advanced coaching for the Preliminary and Mains exams, including specialized physical training.</p>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#8b5cf6', marginBottom: '24px' }}>₹10,000</div>
              <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginBottom: '32px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <li>✓ Advanced Law & IPC Modules</li>
                <li>✓ Officer-Level Physical Training</li>
                <li>✓ Interview Preparation</li>
                <li>✓ Optional Mess Facility (₹2,800/mo)</li>
              </ul>
              <button className="btn btn-primary" style={{ width: '100%', background: '#8b5cf6', borderColor: '#8b5cf6' }} onClick={() => navigate('/login')}>Enroll Now</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="about" className="features-section section-padding">
        <div className="container">
          <div className="section-heading animate-on-scroll fade-up">
            <h2>Why Choose Sai Police Academy?</h2>
            <p>We provide comprehensive preparation for law enforcement examinations with a track record of success.</p>
          </div>
          
          <div className="features-grid">
            <div className="feature-card animate-on-scroll slide-up">
              <div className="feature-icon"><Award size={32} /></div>
              <h3>Expert Faculty</h3>
              <p>Learn from experienced professionals and retired officers who understand the real-world requirements.</p>
            </div>
            <div className="feature-card animate-on-scroll slide-up delay-1">
              <div className="feature-icon"><BookOpen size={32} /></div>
              <h3>Comprehensive Material</h3>
              <p>Access our vast library of premium e-books, previous year question banks, and structured syllabi.</p>
            </div>
            <div className="feature-card animate-on-scroll slide-up delay-2">
              <div className="feature-icon"><Users size={32} /></div>
              <h3>Physical & Mock Training</h3>
              <p>Prepare for the final selection stages with realistic mock interview panels and physical training guidance.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="stats-section section-padding">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item animate-on-scroll fade-in">
              <h3 className="stat-number">500+</h3>
              <p>Successful Candidates</p>
            </div>
            <div className="stat-item animate-on-scroll fade-in delay-1">
              <h3 className="stat-number">50+</h3>
              <p>Expert Mentors</p>
            </div>
            <div className="stat-item animate-on-scroll fade-in delay-2">
              <h3 className="stat-number">10+</h3>
              <p>Years of Excellence</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/logo.png" alt="Sai Police Academy" className="footer-logo" onError={(e) => { e.target.style.display='none'; }} />
              <p style={{ marginTop: '15px' }}>Transforming aspirations into achievements. Your journey to serve and protect begins here.</p>
            </div>
            <div className="footer-links">
              <h4>Quick Links</h4>
              <a href="#about" onClick={(e) => { e.preventDefault(); document.getElementById('about').scrollIntoView({ behavior: 'smooth' }); }}>About Us</a>
              <a href="#courses" onClick={(e) => { e.preventDefault(); document.getElementById('courses').scrollIntoView({ behavior: 'smooth' }); }}>Our Courses</a>
              <a onClick={() => navigate('/login')} style={{cursor: 'pointer'}}>Student Portal</a>
            </div>
            <div className="footer-contact">
              <h4>Contact Us</h4>
              <p>Katpadi Junction, Vellore</p>
              <p>Tamil Nadu, India</p>
              <div style={{ marginTop: '16px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.016335198885!2d79.13600987481977!3d12.970805190855734!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bad47990176df75%3A0xc6bf8f47326e6378!2sKatpadi%20Junction!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
                  width="100%" 
                  height="150" 
                  style={{ border: 0, display: 'block' }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Sai Police Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
