import React, { useState, useEffect } from 'react';
import { getStudents, saveStudent } from '../firebase/firestore';
import { Search, Plus, Edit2, Eye, ShieldAlert, CheckCircle, Clock, Mail } from 'lucide-react';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetailsStudent, setViewDetailsStudent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', rollNumber: '', phone: '', email: '', batch: 'SI Police Batch A', course: '', fee: 0, paid: 0, messEnrollment: false, messFee: 0 });

  const fetchStudents = async () => {
    setLoading(true);
    const data = await getStudents();
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', rollNumber: '', phone: '', email: '', batch: 'SI Police Batch A', course: '', fee: 0, paid: 0, messEnrollment: false, messFee: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingId(student.id);
    setFormData({ messEnrollment: false, messFee: 0, ...student });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveStudent(formData, editingId);
    setIsModalOpen(false);
    fetchStudents();
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || s.feeStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate Summary Statistics
  const totalStudents = students.length;
  const totalPaid = students.filter(s => s.feeStatus === 'PAID').length;
  const totalPending = students.filter(s => s.feeStatus === 'PENDING' || s.feeStatus === 'PARTIAL' || s.feeStatus === 'OVERDUE').length;

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Student Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> New Admission
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-card mount-animate delay-1" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Search size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Total Enrolled Students</p>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{totalStudents}</h2>
          </div>
        </div>
        
        <div className="glass-card mount-animate delay-2" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
          <div style={{ padding: '12px', background: 'var(--success-bg)', borderRadius: '12px', color: 'var(--success)' }}>
            <CheckCircle size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Fully Paid Members</p>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{totalPaid}</h2>
          </div>
        </div>
        
        <div className="glass-card mount-animate delay-3" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: 'var(--danger)' }}>
            <Clock size={32} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Pending/Overdue Payments</p>
            <h2 style={{ fontSize: '1.8rem', margin: 0 }}>{totalPending}</h2>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="glass-card mount-animate delay-2" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by name or reg number..." 
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'PAID', 'PENDING'].map(status => (
              <button 
                key={status}
                className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterStatus(status)}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Reg No.</th>
              <th>Student Name</th>
              <th>Contact</th>
              <th>Batch</th>
              <th>Total Fee</th>
              <th>Balance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center' }}><div className="spinner" style={{ margin: '20px auto' }}></div></td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No students found matching criteria.</td></tr>
            ) : filteredStudents.map(student => (
              <tr key={student.id}>
                <td style={{ fontWeight: 600 }}>{student.rollNumber}</td>
                <td>{student.name}</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{student.phone}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                </td>
                <td>{student.batch}</td>
                <td>₹{Number(student.fee || 0).toLocaleString()}</td>
                <td style={{ fontWeight: 600, color: student.balance > 0 ? 'var(--warning)' : 'var(--success)' }}>
                  ₹{Number(student.balance || 0).toLocaleString()}
                </td>
                <td>
                  <span className={`badge badge-${(student.feeStatus || 'pending').toLowerCase()}`}>
                    {student.feeStatus}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {student.feeStatus === 'PENDING' && student.email && (
                      <a href={`mailto:${student.email}?subject=Sai Academy - Pending Fee Reminder&body=Dear ${student.name},%0D%0A%0D%0AThis is a reminder that you have a pending balance of Rs. ${student.balance} for your course/mess fees at Sai Police Academy.%0D%0A%0D%0APlease clear your dues at the earliest.%0D%0A%0D%0ARegards,%0D%0AAdmin, Sai Police Academy`} 
                         className="icon-btn" 
                         style={{ width: '32px', height: '32px', background: 'rgba(239, 68, 68, 0.1)' }} 
                         title="Send Email Reminder">
                        <Mail size={16} color="var(--danger)" />
                      </a>
                    )}
                    <button className="icon-btn" style={{ width: '32px', height: '32px' }} onClick={() => setViewDetailsStudent(student)} title="View Details">
                      <Eye size={16} color="var(--primary)" />
                    </button>
                    <button className="icon-btn" style={{ width: '32px', height: '32px' }} onClick={() => openEditModal(student)} title="Edit Record">
                      <Edit2 size={16} color="var(--text-secondary)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* View Individual Details Modal */}
      {viewDetailsStudent && (
        <div className="modal-backdrop" onClick={() => setViewDetailsStudent(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ marginBottom: '4px' }}>{viewDetailsStudent.name}</h2>
                <span className={`badge badge-${(viewDetailsStudent.feeStatus || 'pending').toLowerCase()}`}>
                  {viewDetailsStudent.feeStatus}
                </span>
              </div>
              <button className="btn btn-secondary" onClick={() => setViewDetailsStudent(null)}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Registration / Roll No</p>
                <p style={{ fontWeight: 600 }}>{viewDetailsStudent.rollNumber}</p>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Batch & Course</p>
                <p style={{ fontWeight: 600 }}>{viewDetailsStudent.batch}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{viewDetailsStudent.course}</p>
              </div>
              
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Contact Information</p>
                <p style={{ fontWeight: 600 }}>{viewDetailsStudent.phone}</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{viewDetailsStudent.email}</p>
              </div>
              <div style={{ background: 'var(--bg-primary)', padding: '16px', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Mess Enrollment</p>
                <p style={{ fontWeight: 600 }}>{viewDetailsStudent.messEnrollment ? 'Enrolled (₹2,800)' : 'Not Enrolled'}</p>
              </div>
            </div>
            
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--border-glass)', paddingTop: '24px' }}>
              <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Financial Breakdown</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Assessment Fee</span>
                <span style={{ fontWeight: 600 }}>₹{Number(viewDetailsStudent.fee || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Amount Paid</span>
                <span style={{ fontWeight: 600, color: 'var(--success)' }}>₹{Number(viewDetailsStudent.paid || 0).toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border-glass)' }}>
                <span style={{ fontWeight: 600 }}>Current Balance Due</span>
                <span style={{ fontWeight: 700, color: viewDetailsStudent.balance > 0 ? 'var(--danger)' : 'var(--success)' }}>
                  ₹{Number(viewDetailsStudent.balance || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <h2 style={{ marginBottom: '24px' }}>{editingId ? 'Edit Student Details' : 'New Student Admission'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Reg / Roll Number</label>
                  <input type="text" className="form-input" required value={formData.rollNumber} onChange={e => setFormData({...formData, rollNumber: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Batch Selection</label>
                  <select className="form-select" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})}>
                    <option>SI Police Batch A</option>
                    <option>PC Batch B</option>
                    <option>Weekend Special Batch</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Course Enrolled</label>
                  <select className="form-select" required value={formData.course} onChange={e => {
                    const course = e.target.value;
                    const fee = course === 'PC Course' ? 7000 : course === 'SI Course' ? 10000 : 0;
                    setFormData({...formData, course, fee, paid: 0});
                  }}>
                    <option value="" disabled>-- Select Course --</option>
                    <option value="PC Course">Police Constable (PC) - ₹7,000</option>
                    <option value="SI Course">Sub Inspector (SI) - ₹10,000</option>
                  </select>
                </div>
              </div>

              <div className="glass-card" style={{ marginTop: '20px', padding: '16px', background: 'var(--bg-primary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <input 
                    type="checkbox" 
                    id="messEnroll"
                    style={{ width: '18px', height: '18px' }}
                    checked={formData.messEnrollment} 
                    onChange={e => {
                      const isChecked = e.target.checked;
                      setFormData({...formData, messEnrollment: isChecked, messFee: isChecked ? 2800 : 0})
                    }} 
                  />
                  <label htmlFor="messEnroll" className="form-label" style={{ marginBottom: 0, fontSize: '1rem', cursor: 'pointer' }}>Enroll in Academy Mess? (₹2,800/month)</label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Student Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManager;
