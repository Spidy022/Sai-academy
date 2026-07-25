import React, { useState, useEffect } from 'react';
import { getPayments, getStudents, recordPayment } from '../firebase/firestore';
import { Search, Plus, CheckCircle, FileText, CreditCard } from 'lucide-react';
import { useAuth } from '../firebase/auth';

const PaymentTracker = () => {
  const { isAdmin, currentUser, userProfile } = useAuth();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Payment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUPIModalOpen, setIsUPIModalOpen] = useState(false);
  const [formData, setFormData] = useState({ studentDocId: '', amount: '', paymentMethod: 'UPI', remarks: '' });
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    let [pays, stus] = await Promise.all([getPayments(), getStudents()]);
    
    // Privacy Filtering: Students can only see their own records
    if (!isAdmin() && currentUser) {
      pays = pays.filter(p => p.studentDocId === currentUser.uid);
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
    if (!isAdmin()) return;
    setProcessing(true);
    
    const student = students.find(s => s.id === formData.studentDocId);
    
    await recordPayment({
      studentDocId: formData.studentDocId,
      studentId: student?.rollNumber || "",
      studentName: student?.name || "",
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      remarks: formData.remarks
    });
    
    setProcessing(false);
    setIsModalOpen(false);
    fetchData(); // Refresh both payments and students balances
  };

  const handleUPIPayment = async () => {
    setProcessing(true);
    // Student initiates their own payment
    const student = students.find(s => s.id === currentUser.uid);
    if (!student || student.balance <= 0) {
      alert("No pending dues found.");
      setProcessing(false);
      return;
    }
    
    await recordPayment({
      studentDocId: currentUser.uid,
      studentId: student.rollNumber || "",
      studentName: student.name || userProfile?.name,
      amount: student.balance,
      paymentMethod: 'UPI_QR',
      remarks: 'Self-Paid via Portal'
    });
    
    setProcessing(false);
    setIsUPIModalOpen(false);
    fetchData();
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">{isAdmin() ? 'Fee Transactions' : 'My Payment History'}</h1>
        {isAdmin() ? (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Record Admin Payment
          </button>
        ) : (
          <button className="btn btn-success" onClick={() => setIsUPIModalOpen(true)} style={{ background: 'var(--success)' }}>
            <CreditCard size={18} /> Pay Fees via UPI
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Receipt No.</th>
              <th>Date</th>
              <th>Student Details</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center' }}><div className="spinner" style={{ margin: '20px auto' }}></div></td></tr>
            ) : payments.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No payment records found.</td></tr>
            ) : payments.map(payment => (
              <tr key={payment.id}>
                <td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{payment.receiptNumber || 'N/A'}</td>
                <td>{new Date(payment.paidAt).toLocaleDateString()}</td>
                <td>
                  <div style={{ fontWeight: 500 }}>{payment.studentName}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{payment.studentId}</div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--success)' }}>₹{Number(payment.amount).toLocaleString()}</td>
                <td>
                  <span style={{ padding: '4px 10px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', fontSize: '0.8rem' }}>
                    {payment.paymentMethod || payment.gateway}
                  </span>
                </td>
                <td>
                  {payment.status === 'SUCCESS' ? (
                    <span className="badge badge-paid"><CheckCircle size={12} /> Verified</span>
                  ) : (
                    <span className="badge badge-pending">{payment.status}</span>
                  )}
                </td>
                <td>
                  <button className="btn btn-sm btn-secondary" title="View Receipt">
                    <FileText size={14} /> Receipt
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && isAdmin() && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 style={{ marginBottom: '24px' }}>Record New Fee Payment</h2>
            <form onSubmit={handleRecordPayment}>
              <div className="form-group">
                <label className="form-label">Select Student (Pending Dues)</label>
                <select className="form-select" required value={formData.studentDocId} onChange={e => {
                  const student = students.find(s => s.id === e.target.value);
                  setFormData({...formData, studentDocId: e.target.value, amount: student ? student.balance : ''});
                }}>
                  <option value="" disabled>-- Select Candidate --</option>
                  {students.filter(s => s.balance > 0).map(s => (
                    <option key={s.id} value={s.id}>{s.rollNumber} - {s.name} (Due: ₹{s.balance})</option>
                  ))}
                </select>
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Payment Amount (₹) - FULL FEE ONLY</label>
                  <input type="number" className="form-input" required disabled value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                    <option value="UPI">UPI (GPay/PhonePe)</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Remarks / Transaction Ref (Optional)</label>
                <input type="text" className="form-input" value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} placeholder="e.g. UTR Number or Cashier Name" />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={processing}>
                  {processing ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Simulated UPI QR Gateway for Students */}
      {isUPIModalOpen && !isAdmin() && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: '400px' }}>
            <h2 style={{ marginBottom: '16px' }}>UPI Payment Gateway</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.9rem' }}>
              Scan the QR Code below using any UPI App (GPay, PhonePe, Paytm) to securely clear your pending academy dues.
            </p>
            <div style={{ background: 'white', padding: '16px', borderRadius: '12px', display: 'inline-block', marginBottom: '24px' }}>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=saiacademy@upi&pn=Sai%20Academy&cu=INR" alt="UPI QR Code" style={{ width: '200px', height: '200px' }} />
            </div>
            
            <div style={{ background: 'var(--warning-bg)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', fontSize: '0.85rem', color: 'var(--warning)' }}>
              *This is a simulated secure gateway. Clicking the button below bypasses the actual scan for testing purposes.
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsUPIModalOpen(false)} style={{ flex: 1 }}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleUPIPayment} disabled={processing} style={{ flex: 1 }}>
                {processing ? 'Processing...' : 'Simulate Payment Success'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentTracker;
