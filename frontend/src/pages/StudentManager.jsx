import React, { useState, useEffect } from 'react';
import { getStudents, saveStudent } from '../firebase/firestore';
import { Search, Plus, Edit2, Eye, ShieldAlert, CheckCircle, Clock, Mail, Download, Filter } from 'lucide-react';

const sampleStudentsFallback = [
  { id: '1', rollNumber: 'SAI-2026-101', name: 'Vikram Goutham', phone: '+91 98450 12345', email: 'student@test.com', batch: 'SI Police Batch A', course: 'Police Sub-Inspector Coaching (SI)', fee: 35000, paid: 35000, balance: 0, feeStatus: 'PAID', messEnrollment: true, attendancePercentage: 96.0 },
  { id: '2', rollNumber: 'SAI-2026-102', name: 'Ananya S. Rao', phone: '+91 97412 89012', email: 'ananya.rao@gmail.com', batch: 'SI Police Batch A', course: 'Police Sub-Inspector Coaching (SI)', fee: 35000, paid: 20000, balance: 15000, feeStatus: 'PARTIAL', messEnrollment: false, attendancePercentage: 89.5 },
  { id: '3', rollNumber: 'SAI-2026-103', name: 'Karthik Rajan', phone: '+91 91234 56789', email: 'karthik.r@yahoo.com', batch: 'Constable Direct Batch', course: 'Constable Direct Recruitment Batch', fee: 22000, paid: 5000, balance: 17000, feeStatus: 'PARTIAL', messEnrollment: true, attendancePercentage: 91.0 },
  { id: '4', rollNumber: 'SAI-2026-104', name: 'Deepa Krishnan', phone: '+91 94455 66778', email: 'deepa.k@outlook.com', batch: 'Executive DSP Track', course: 'Executive DSP Foundation Track', fee: 55000, paid: 0, balance: 55000, feeStatus: 'OVERDUE', messEnrollment: false, attendancePercentage: 84.0 },
  { id: '5', rollNumber: 'SAI-2026-105', name: 'Rohit Verma', phone: '+91 98877 66554', email: 'rohit.v@gmail.com', batch: 'SI Police Batch A', course: 'Police Sub-Inspector Coaching (SI)', fee: 35000, paid: 35000, balance: 0, feeStatus: 'PAID', messEnrollment: true, attendancePercentage: 98.2 }
];

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedBatch, setSelectedBatch] = useState('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewDetailsStudent, setViewDetailsStudent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', rollNumber: '', phone: '', email: '', batch: 'SI Police Batch A', course: '', fee: 0, paid: 0, messEnrollment: false, messFee: 0 });

  const fetchStudents = async () => {
    setLoading(true);
    let data = await getStudents();
    if (data.length === 0) {
      data = sampleStudentsFallback;
    }
    setStudents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: '', rollNumber: '', phone: '', email: '', batch: 'SI Police Batch A', course: 'SI Course', fee: 10000, paid: 0, messEnrollment: false, messFee: 0 });
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

  const exportCSV = () => {
    const headers = ["Reg Number", "Name", "Batch", "Course", "Phone", "Email", "Total Fee", "Paid", "Balance", "Status"];
    const rows = filteredStudents.map(s => [
      `"${s.rollNumber || ''}"`,
      `"${s.name || ''}"`,
      `"${s.batch || ''}"`,
      `"${s.course || ''}"`,
      `"${s.phone || ''}"`,
      `"${s.email || ''}"`,
      s.fee || 0,
      s.paid || 0,
      s.balance || 0,
      `"${s.feeStatus || ''}"`
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Sai_Academy_Students_Report_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = (s.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (s.rollNumber || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'ALL' || s.feeStatus === filterStatus;
    const matchesBatch = selectedBatch === 'ALL' || s.batch === selectedBatch;
    return matchesSearch && matchesStatus && matchesBatch;
  });

  const totalStudents = students.length;
  const totalPaid = students.filter(s => s.feeStatus === 'PAID').length;
  const totalPending = students.filter(s => s.feeStatus === 'PENDING' || s.feeStatus === 'PARTIAL' || s.feeStatus === 'OVERDUE').length;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Student Directory & Admissions</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px' }}>
            Manage candidate profiles, course enrollment, mess facilities, and fee balances.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-secondary" onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Download size={16} /> Export CSV Report
          </button>
          <button className="btn btn-primary" onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Plus size={18} /> New Admission
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <div className="glass-card mount-animate delay-1" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
          <div style={{ padding: '12px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
            <Search size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Total Enrolled Candidates</p>
            <h2 style={{ fontSize: '1.6rem', margin: 0 }}>{totalStudents}</h2>
          </div>
        </div>
        
        <div className="glass-card mount-animate delay-2" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
          <div style={{ padding: '12px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '12px', color: '#10b981' }}>
            <CheckCircle size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Fully Cleared Accounts</p>
            <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#10b981' }}>{totalPaid}</h2>
          </div>
        </div>
        
        <div className="glass-card mount-animate delay-3" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#ef4444' }}>
            <Clock size={28} />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px' }}>Pending Balance Dues</p>
            <h2 style={{ fontSize: '1.6rem', margin: 0, color: '#ef4444' }}>{totalPending}</h2>
          </div>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="glass-card mount-animate delay-2" style={{ marginBottom: '24px', padding: '20px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search candidate by name or registration ID..." 
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={16} color="var(--text-muted)" />
            <select 
              className="form-select" 
              value={selectedBatch} 
              onChange={(e) => setSelectedBatch(e.target.value)}
              style={{ width: '180px', padding: '10px' }}
            >
              <option value="ALL">All Batches</option>
              <option value="SI Police Batch A">SI Police Batch A</option>
              <option value="Constable Direct Batch">Constable Direct Batch</option>
              <option value="Executive DSP Track">Executive DSP Track</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '6px' }}>
            {['ALL', 'PAID', 'PARTIAL', 'OVERDUE'].map(status => (
              <button 
                key={status}
                className={`btn btn-sm ${filterStatus === status ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setFilterStatus(status)}
                style={{ fontSize: '0.8rem', padding: '6px 12px' }}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Student Table */}
      <div className="table-container" style={{ background: 'var(--bg-card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Reg No.</th>
              <th>Candidate Name</th>
              <th>Contact Details</th>
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
                <td style={{ fontWeight: 700, fontFamily: 'monospace', color: 'var(--primary)' }}>{student.rollNumber}</td>
                <td style={{ fontWeight: 600 }}>{student.name}</td>
                <td>
                  <div style={{ fontSize: '0.85rem' }}>{student.phone}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{student.email}</div>
                </td>
                <td>{student.batch}</td>
                <td>₹{Number(student.fee || 0).toLocaleString('en-IN')}</td>
                <td style={{ fontWeight: 700, color: student.balance > 0 ? '#ef4444' : '#10b981' }}>
                  ₹{Number(student.balance || 0).toLocaleString('en-IN')}
                </td>
                <td>
                  <span className={`badge badge-${(student.feeStatus || 'pending').toLowerCase()}`}>
                    {student.feeStatus}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
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
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '580px', borderRadius: '16px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ marginBottom: '4px' }}>{viewDetailsStudent.name}</h2>
                <span className={`badge badge-${(viewDetailsStudent.feeStatus || 'pending').toLowerCase()}`}>
                  {viewDetailsStudent.feeStatus}
                </span>
              </div>
              <button className="btn btn-secondary" onClick={() => setViewDetailsStudent(null)}>Close</button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Registration ID</p>
                <p style={{ fontWeight: 700, fontFamily: 'monospace' }}>{viewDetailsStudent.rollNumber}</p>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Batch & Program</p>
                <p style={{ fontWeight: 600 }}>{viewDetailsStudent.batch}</p>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Contact Phone</p>
                <p style={{ fontWeight: 600 }}>{viewDetailsStudent.phone}</p>
              </div>
              <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: '10px' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Mess Facility</p>
                <p style={{ fontWeight: 600 }}>{viewDetailsStudent.messEnrollment ? 'Enrolled (₹2,800/mo)' : 'Not Enrolled'}</p>
              </div>
            </div>
            
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Fee Assessment</span>
                <span style={{ fontWeight: 600 }}>₹{Number(viewDetailsStudent.fee || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Fee Paid</span>
                <span style={{ fontWeight: 600, color: '#10b981' }}>₹{Number(viewDetailsStudent.paid || 0).toLocaleString('en-IN')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', paddingTop: '12px', borderTop: '1px dashed var(--border-glass)' }}>
                <span style={{ fontWeight: 700 }}>Current Balance Due</span>
                <span style={{ fontWeight: 800, fontSize: '1.2rem', color: viewDetailsStudent.balance > 0 ? '#ef4444' : '#10b981' }}>
                  ₹{Number(viewDetailsStudent.balance || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Form Modal */}
      {isModalOpen && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ borderRadius: '16px', padding: '32px' }}>
            <h2 style={{ marginBottom: '24px' }}>{editingId ? 'Edit Candidate Profile' : 'New Candidate Admission'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid-cols-2">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Registration Roll Number</label>
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
                    <option>Constable Direct Batch</option>
                    <option>Executive DSP Track</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Course Enrolled</label>
                  <select className="form-select" required value={formData.course} onChange={e => {
                    const course = e.target.value;
                    const fee = course === 'Police Constable (PC)' ? 7000 : course === 'Sub Inspector (SI)' ? 10000 : 35000;
                    setFormData({...formData, course, fee, paid: 0});
                  }}>
                    <option value="" disabled>-- Select Course --</option>
                    <option value="Police Constable (PC)">Police Constable (PC) - ₹7,000</option>
                    <option value="Sub Inspector (SI)">Sub Inspector (SI) - ₹10,000</option>
                    <option value="Police Sub-Inspector Coaching (SI)">Comprehensive SI Coaching - ₹35,000</option>
                  </select>
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
