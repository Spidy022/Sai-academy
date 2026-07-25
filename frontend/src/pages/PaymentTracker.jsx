import React, { useState, useEffect } from 'react';
import { getPayments, getStudents, recordPayment } from '../firebase/firestore';
import { Search, Plus, CheckCircle, FileText, CreditCard, Printer, X, ShieldCheck } from 'lucide-react';
import { useAuth } from '../firebase/auth';

const PaymentTracker = () => {
  const { isAdmin, currentUser, userProfile } = useAuth();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Payment & Receipt Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [formData, setFormData] = useState({ studentDocId: '', amount: '', paymentMethod: 'UPI', remarks: '' });
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let [pays, stus] = await Promise.all([getPayments(), getStudents()]);
    
    // Fallback sample payment records if empty
    if (pays.length === 0) {
      pays = [
        {
          id: 'pay_101',
          receiptNumber: 'SAI-2026-901',
          paidAt: Date.now() - 86400000 * 2,
          studentName: 'Vikram Goutham',
          studentId: 'SAI-2026-101',
          amount: 35000,
          paymentMethod: 'UPI (GPay)',
          status: 'SUCCESS'
        },
        {
          id: 'pay_102',
          receiptNumber: 'SAI-2026-902',
          paidAt: Date.now() - 86400000 * 5,
          studentName: 'Ananya S. Rao',
          studentId: 'SAI-2026-102',
          amount: 20000,
          paymentMethod: 'UPI / PhonePe',
          status: 'SUCCESS'
        }
      ];
    }

    // Privacy Filtering: Students can only see their own records
    if (!isAdmin() && currentUser) {
      pays = pays.filter(p => p.studentDocId === currentUser.uid || p.studentName === userProfile?.name);
      stus = stus.filter(s => s.id === currentUser.uid);
    }

    setPayments(pays.sort((a, b) => b.paidAt - a.paidAt));
    setStudents(stus);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    setProcessing(true);
    
    const student = students.find(s => s.id === formData.studentDocId);
    
    const newRecord = await recordPayment({
      studentDocId: formData.studentDocId,
      studentId: student?.rollNumber || "SAI-2026-108",
      studentName: student?.name || "Student Candidate",
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      remarks: formData.remarks
    });
    
    setProcessing(false);
    setIsModalOpen(false);
    fetchData();
  };

  const handleUPIPayment = async () => {
    setProcessing(true);
    const student = students.find(s => s.id === currentUser?.uid);
    
    await recordPayment({
      studentDocId: currentUser?.uid || "STU_DEMO",
      studentId: student?.rollNumber || "SAI-2026-101",
      studentName: student?.name || userProfile?.name || "Vikram Goutham",
      amount: 15000,
      paymentMethod: 'UPI_QR',
      remarks: 'Self-Paid via Portal'
    });
    
    setProcessing(false);
    setIsUPIModalOpen(false);
    fetchData();
  };

  const printReceipt = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">{isAdmin() ? 'Fee Transactions' : 'My Payment History'}</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Official tuition and hostel fee payment receipts for Sai Police Academy.
          </p>
        </div>

        {isAdmin() ? (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Record Fee Payment
          </button>
        ) : (
          <button className="btn btn-success" onClick={() => setIsUPIModalOpen(true)} style={{ background: '#10b981', borderColor: '#10b981' }}>
            <CreditCard size={18} /> Pay Dues via UPI QR
          </button>
        )}
      </div>

      <div className="table-container" style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Receipt No.</th>
              <th>Date</th>
              <th>Student Candidate</th>
              <th>Amount</th>
              <th>Payment Gateway</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}><div className="spinner" style={{ margin: '20px auto' }}></div></td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No payment records found.</td></tr>
            ) : payments.map(payment => (
              <tr key={payment.id}>
                <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{payment.receiptNumber || 'SAI-2026-901'}</td>
                <td>{new Date(payment.paidAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                <td>
                  <div style={{ fontWeight: 600 }}>{payment.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{payment.studentId}</div>
                </td>
                <td style={{ fontWeight: 800, color: '#10b981' }}>₹{Number(payment.amount).toLocaleString('en-IN')}</td>
                <td>
                  <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {payment.paymentMethod || payment.gateway || 'UPI'}
                  </span>
                </td>
                <td>
                  <span className="badge badge-paid" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={12} /> Verified
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-secondary" onClick={() => setSelectedReceipt(payment)} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem' }}>
                    <FileText size={14} /> Printable Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Printable Receipt Modal */}
      {selectedReceipt && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="modal-content printable-area" style={{ background: 'white', color: '#111827', maxWidth: '520px', width: '100%', borderRadius: '16px', padding: '32px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <button 
              onClick={() => setSelectedReceipt(null)} 
              style={{ position: 'absolute', right: '20px', top: '20px', background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} color="#4b5563" />
            </button>

            <div style={{ textAlign: 'center', borderBottom: '2px solid #e5e7eb', paddingBottom: '20px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <ShieldCheck size={28} color="#2563eb" />
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#1e3a8a', fontWeight: 800 }}>SAI POLICE ACADEMY</h2>
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6b7280' }}>Katpadi Junction, Vellore, Tamil Nadu - 632007</p>
              <div style={{ marginTop: '8px', display: 'inline-block', background: '#dbeafe', color: '#1e40af', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                OFFICIAL TUITION & FEES RECEIPT
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem', marginBottom: '24px' }}>
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', display: 'block' }}>RECEIPT NUMBER</span>
                <strong style={{ fontFamily: 'monospace', color: '#111827' }}>{selectedReceipt.receiptNumber || 'SAI-2026-901'}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', display: 'block' }}>PAYMENT DATE</span>
                <strong>{new Date(selectedReceipt.paidAt || Date.now()).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</strong>
              </div>
              <div>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', display: 'block' }}>STUDENT NAME</span>
                <strong>{selectedReceipt.studentName}</strong>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ color: '#6b7280', fontSize: '0.8rem', display: 'block' }}>REGISTRATION ID</span>
                <strong style={{ fontFamily: 'monospace' }}>{selectedReceipt.studentId || 'SAI-2026-101'}</strong>
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', color: '#4b5563' }}>Description</th>
                  <th style={{ textAlign: 'right', padding: '8px 12px', color: '#4b5563' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 12px' }}>Police Sub-Inspector / Constable Coaching Dues</td>
                  <td style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 600 }}>₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}</td>
                </tr>
                <tr style={{ background: '#f9fafb', fontWeight: 800 }}>
                  <td style={{ padding: '12px', color: '#111827' }}>TOTAL PAID</td>
                  <td style={{ textAlign: 'right', padding: '12px', color: '#16a34a', fontSize: '1.1rem' }}>₹{Number(selectedReceipt.amount).toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed #d1d5db', paddingTop: '16px', fontSize: '0.8rem', color: '#6b7280' }}>
              <div>Status: <strong style={{ color: '#16a34a' }}>VERIFIED & PAID</strong></div>
              <button className="btn btn-primary" onClick={printReceipt} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', fontSize: '0.85rem' }}>
                <Printer size={16} /> Print / Save PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated UPI QR Gateway Modal */}
      {isUPIModalOpen && (
        <div className="modal-backdrop" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: '400px', background: 'var(--bg-card)', padding: '32px', borderRadius: '16px' }}>
            <h2 style={{ marginBottom: '12px' }}>Pay via UPI QR Code</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '0.9rem' }}>
              Scan using Google Pay, PhonePe, or Paytm to complete fee payment.
            </p>

            <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '20px' }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=saipoliceacademy@upi&pn=Sai%20Police%20Academy&cu=INR" alt="UPI QR Code" style={{ width: '180px', height: '180px' }} />
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsUPIModalOpen(false)} style={{ flex: 1 }}>Close</button>
              <button type="button" className="btn btn-primary" onClick={handleUPIPayment} disabled={processing} style={{ flex: 1 }}>
                {processing ? 'Processing...' : 'Simulate Success'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTracker;
