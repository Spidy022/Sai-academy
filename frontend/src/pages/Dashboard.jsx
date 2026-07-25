import React, { useEffect, useState } from 'react';
import StatCard from '../components/StatCard';
import LocationWidget from '../components/LocationWidget';
import { useAuth } from '../firebase/auth';
import { getStudents, getPayments, getCourses, getNotices } from '../firebase/firestore';
import { Users, CreditCard, Banknote, BookOpen, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { userProfile, isAdmin } = useAuth();
  const [stats, setStats] = useState({ totalStudents: 0, pendingAmount: 0, receivedAmount: 0, courses: 0 });
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (isAdmin()) {
        const [students, payments, courses, nts] = await Promise.all([
          getStudents(), getPayments(), getCourses(), getNotices()
        ]);
        
        let pending = 0;
        students.forEach(s => {
          pending += Number(s.balance || 0);
        });

        let received = 0;
        payments.forEach(p => {
          if (p.status === 'SUCCESS') received += Number(p.amount || 0);
        });

        setStats({
          totalStudents: students.length,
          pendingAmount: pending,
          receivedAmount: received,
          courses: courses.length
        });
        setNotices(nts.slice(0, 3));
      } else {
        const nts = await getNotices();
        setNotices(nts.slice(0, 3));
      }
      setLoading(false);
    };
    fetchData();
  }, [isAdmin]);

  if (loading) return <div className="spinner" style={{ margin: '40px auto' }}></div>;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {userProfile?.name?.split(' ')[0] || 'User'}</h1>
      </div>

      {isAdmin() ? (
        <>
          <div className="grid-cols-4" style={{ marginBottom: '40px' }}>
            <StatCard 
              title="Total Students" 
              value={stats.totalStudents} 
              icon={<Users />} 
              colorGradient={['#3b82f6', '#6366f1']} 
              subtitle="Enrolled active candidates"
            />
            <StatCard 
              title="Fees Received" 
              value={`₹${stats.receivedAmount.toLocaleString()}`} 
              icon={<Banknote />} 
              colorGradient={['#10b981', '#059669']} 
              subtitle="Total successful payments"
            />
            <StatCard 
              title="Pending Dues" 
              value={`₹${stats.pendingAmount.toLocaleString()}`} 
              icon={<AlertTriangle />} 
              colorGradient={['#ef4444', '#f97316']} 
              subtitle="Outstanding student balances"
            />
            <StatCard 
              title="Active Courses" 
              value={stats.courses} 
              icon={<BookOpen />} 
              colorGradient={['#8b5cf6', '#d946ef']} 
              subtitle="Coaching batches available"
            />
          </div>
        </>
      ) : (
        <div className="glass-card mount-animate delay-1" style={{ marginBottom: '40px', background: 'var(--primary-gradient)', color: 'white' }}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Your Academic Status</h2>
          <p style={{ opacity: 0.9, marginTop: '8px', marginBottom: '24px', maxWidth: '600px', fontSize: '1.05rem', lineHeight: 1.5 }}>
            Welcome to the student portal. From here, you can access your premium study materials, enroll in new coaching batches, and manage your hostel and tuition fees.
          </p>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <button className="btn" style={{ background: 'white', color: 'var(--primary)', fontWeight: 600, border: 'none' }} onClick={() => window.location.href='/free-courses'}>Access Study Portal</button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }} onClick={() => window.location.href='/enrollment'}>Enroll & Pay Fees</button>
          </div>
        </div>
      )}

      <div className="grid-cols-2">
        <div className="glass-card mount-animate delay-2">
          <h2 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Recent Academy Notices</h2>
          {notices.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No recent notices published.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notices.map((n, i) => (
                <div key={i} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: `4px solid ${n.priority === 'Urgent' ? 'var(--warning)' : 'var(--primary)'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <strong>{n.title}</strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{n.date}</span>
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{n.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="glass-card mount-animate delay-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-glass)' }}>
           <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: 'var(--primary)' }}>
             <CreditCard size={40} />
           </div>
           <h3 style={{ fontSize: '1.25rem', marginBottom: '12px' }}>Fee Payment & Enrollment</h3>
           <p style={{ color: 'var(--text-secondary)', marginTop: '0', maxWidth: '300px', marginBottom: '24px', fontSize: '0.95rem' }}>
             Securely pay your course fees or hostel mess dues via UPI.
           </p>
           {isAdmin() ? (
             <button className="btn btn-primary" onClick={() => window.location.href='/payments'}>Review Payments</button>
           ) : (
             <button className="btn btn-primary" style={{ padding: '12px 24px' }} onClick={() => window.location.href='/enrollment'}>Make a Payment</button>
           )}
        </div>
      </div>
      
      <div style={{ marginTop: '24px' }}>
        <LocationWidget />
      </div>
      {/* WhatsApp Support Button */}
      {!isAdmin() && (
        <a 
          href="https://wa.me/910000000000?text=Hello%20Sai%20Academy%2C%20I%20need%20help%20with%20my%20student%20account." 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            background: '#25D366',
            color: 'white',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
            zIndex: 1000,
            transition: 'transform 0.2s ease',
            textDecoration: 'none'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          title="Contact Support on WhatsApp"
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </a>
      )}
    </div>
  );
};

export default Dashboard;
