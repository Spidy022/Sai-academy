import React, { useState } from 'react';
import { useAuth } from '../firebase/auth';
import { Shield, BookOpen, Utensils, CreditCard, CheckCircle } from 'lucide-react';
import { db } from '../firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const Enrollment = () => {
  const { userProfile, refreshProfile } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const [showQR, setShowQR] = useState(false);
  const upiId = 'saiacademy@ybl'; // Dummy UPI ID for simulation

  const courses = [
    { id: 'pc', title: 'Police Constable (PC)', price: 7000, icon: <Shield size={32} />, color: 'var(--primary)', desc: 'Complete preparation for direct recruitment examinations.' },
    { id: 'si', title: 'Sub Inspector (SI)', price: 10000, icon: <BookOpen size={32} />, color: '#8b5cf6', desc: 'Advanced coaching for Prelims and Mains including physicals.' },
    { id: 'mess', title: 'Hostel Mess Fee', price: 2800, icon: <Utensils size={32} />, color: 'var(--success)', desc: 'Monthly mess enrollment for academy hostellers.' }
  ];

  const handlePaymentClick = () => {
    if (!selectedCourse) return;
    setShowQR(true);
  };

  const simulateSuccess = async () => {
    setProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(async () => {
      try {
        const paymentId = 'PAY_' + Math.random().toString(36).substr(2, 9).toUpperCase();
        
        // Log payment in Firestore
        await setDoc(doc(db, 'payments', paymentId), {
          uid: userProfile?.id || 'demo_user',
          email: userProfile?.email || 'demo@test.com',
          courseId: selectedCourse.id,
          courseName: selectedCourse.title,
          amount: selectedCourse.price,
          status: 'SUCCESS',
          method: 'UPI',
          timestamp: serverTimestamp()
        });

        // In a real app, we would update the user's document to reflect enrollment here
        setSuccess(true);
        if(refreshProfile) await refreshProfile();
      } catch (err) {
        console.error("Payment simulation error", err);
      } finally {
        setProcessing(false);
      }
    }, 1500);
  };

  if (success) {
    return (
      <div className="mount-animate" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <CheckCircle size={80} color="var(--success)" style={{ marginBottom: '24px' }} />
        <h1 style={{ marginBottom: '16px' }}>Payment Successful!</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '1.1rem', maxWidth: '400px' }}>
          Your payment of ₹{selectedCourse.price.toLocaleString()} for {selectedCourse.title} has been received via UPI.
        </p>
        <button className="btn btn-primary" onClick={() => window.location.href='/dashboard'}>Return to Dashboard</button>
      </div>
    );
  }
  
  if (showQR && selectedCourse) {
    const upiLink = `upi://pay?pa=${upiId}&pn=Sai%20Academy&am=${selectedCourse.price}&cu=INR`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;
    
    return (
      <div className="mount-animate" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '16px' }}>Scan to Pay with any UPI App</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Pay ₹{selectedCourse.price.toLocaleString()} for {selectedCourse.title}</p>
        
        <div style={{ padding: '24px', background: 'white', borderRadius: '16px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)', marginBottom: '32px' }}>
          <img src={qrCodeUrl} alt="UPI QR Code" style={{ width: '200px', height: '200px' }} />
        </div>
        
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <a href={upiLink} className="btn btn-primary" style={{ background: '#25D366', borderColor: '#25D366' }}>
            Open UPI App
          </a>
          <button className="btn btn-secondary" onClick={() => setShowQR(false)}>Cancel</button>
        </div>
        
        <div style={{ marginTop: '24px', padding: '16px', background: 'var(--bg-secondary)', borderRadius: '12px' }}>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '12px' }}>Demo Mode: Click below to simulate a successful payment after scanning.</p>
          <button className="btn btn-primary" onClick={simulateSuccess} disabled={processing}>
            {processing ? 'Processing...' : 'Simulate Success'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mount-animate">
      <div className="page-header">
        <h1 className="page-title">Course Enrollment & Fees</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>Select a program below to securely pay your fees via UPI.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {courses.map((course, idx) => (
          <div 
            key={course.id} 
            className={`glass-card mount-animate delay-${idx + 1}`}
            style={{ 
              cursor: 'pointer', 
              border: selectedCourse?.id === course.id ? `2px solid ${course.color}` : '1px solid var(--border-glass)',
              transform: selectedCourse?.id === course.id ? 'translateY(-4px)' : 'none',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => setSelectedCourse(course)}
          >
            {selectedCourse?.id === course.id && (
              <div style={{ position: 'absolute', top: 0, right: 0, background: course.color, color: 'white', padding: '4px 12px', borderBottomLeftRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}>
                SELECTED
              </div>
            )}
            <div style={{ padding: '16px', background: `${course.color}15`, width: 'max-content', borderRadius: '12px', color: course.color, marginBottom: '20px' }}>
              {course.icon}
            </div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>{course.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', minHeight: '40px' }}>{course.desc}</p>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              ₹{course.price.toLocaleString()}
            </div>
          </div>
        ))}
      </div>

      {selectedCourse && (
        <div className="glass-card mount-animate" style={{ border: '1px solid var(--primary)', background: 'var(--bg-secondary)' }}>
          <h3 style={{ marginBottom: '24px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px' }}>Checkout Summary</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1.1rem' }}>
            <span>{selectedCourse.title}</span>
            <span>₹{selectedCourse.price.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            <span>Platform Fee</span>
            <span>Free</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '32px', fontSize: '1.4rem', fontWeight: 700, borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
            <span>Total Payable</span>
            <span>₹{selectedCourse.price.toLocaleString()}</span>
          </div>

          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: '#22c55e', borderColor: '#22c55e' }}
            onClick={handlePaymentClick}
          >
            <CreditCard /> Pay via UPI
          </button>
          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            You will be shown a secure QR code to scan with Google Pay, PhonePe, or Paytm.
          </p>
        </div>
      )}
    </div>
  );
};

export default Enrollment;
