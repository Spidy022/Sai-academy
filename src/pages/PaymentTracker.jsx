import React, { useState, useEffect } from 'react';
import { getPayments, getStudents, recordPayment } from '../firebase/firestore';
import { Search, Plus, CheckCircle, FileText } from 'lucide-react';
import { useAuth } from '../firebase/auth';

const PaymentTracker = () => {
  const { isAdmin } = useAuth();
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Payment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ studentDocId: '', amount: '', paymentMethod: 'UPI', remarks: '' });
  const [processing, setProcessing] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const [pays, stus] = await Promise.all([getPayments(), getStudents()]);
    // Sort payments by paidAt descending
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Fee Transactions & Payments</h1>
        {isAdmin() && (
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Record Payment
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
                <label className="form-label">Select Student</label>
                <select className="form-select" required value={formData.studentDocId} onChange={e => setFormData({...formData, studentDocId: e.target.value})}>
                  <option value="" disabled>-- Select Candidate --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.rollNumber} - {s.name} (Due: ₹{s.balance})</option>
                  ))}
                </select>
              </div>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Payment Amount (₹)</label>
                  <input type="number" className="form-input" required min="1" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Payment Method</label>
                  <select className="form-select" value={formData.paymentMethod} onChange={e => setFormData({...formData, paymentMethod: e.target.value})}>
                    <option value="UPI">UPI (GPay/PhonePe)</option>
                    <option value="Cash">Cash (Counter)</option>
                    <option value="Bank Transfer">NEFT/RTGS</option>
                    <option value="Card">Credit/Debit Card</option>
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
    </div>
  );
};

export default PaymentTracker;
