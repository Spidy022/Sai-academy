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
        <div className="glass-card" style={{ marginBottom: '40px' }}>
          <h2>Your Academic Status</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>
            Access your study materials, track your attendance, and verify your fee status through the sidebar navigation.
          </p>
        </div>
      )}

      <div className="grid-cols-2">
        <div className="glass-card">
          <h2 style={{ marginBottom: '20px', fontSize: '1.25rem' }}>Recent Academy Notices</h2>
          {notices.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No recent notices published.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {notices.map((n, i) => (
                <div key={i} style={{ padding: '16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', borderLeft: `4px solid ${n.priority === 'Urgent' ? 'var(--danger)' : 'var(--primary)'}` }}>
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
        
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', flexDirection: 'column', textAlign: 'center' }}>
           <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
             <CreditCard size={48} color="var(--primary)" opacity={0.5} />
           </div>
           <h3>Fee Payment Portal Active</h3>
           <p style={{ color: 'var(--text-muted)', marginTop: '10px', maxWidth: '300px' }}>
             Ensure all tuition and hostel dues are cleared before the upcoming preliminary examination.
           </p>
        </div>
      </div>
      
      <div style={{ marginTop: '24px' }}>
        <LocationWidget />
      </div>
    </div>
  );
};

export default Dashboard;
