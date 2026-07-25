import React, { useState, useEffect } from 'react';
import { getStudents, saveStudent } from '../firebase/firestore';
import { Search, Plus, Edit2, ShieldAlert } from 'lucide-react';

const StudentManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', rollNumber: '', phone: '', email: '', batch: 'SI Police Batch A', course: '', fee: 0, paid: 0 });

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
    setFormData({ name: '', rollNumber: '', phone: '', email: '', batch: 'SI Police Batch A', course: '', fee: 0, paid: 0 });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingId(student.id);
    setFormData(student);
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

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Student Management</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={18} /> New Admission
        </button>
      </div>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-input" 
              placeholder="Search by name or roll number..." 
              style={{ paddingLeft: '40px' }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['ALL', 'PAID', 'PARTIAL', 'PENDING', 'OVERDUE'].map(status => (
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
              <th>Roll No.</th>
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
                  <button className="icon-btn" style={{ width: '32px', height: '32px' }} onClick={() => openEditModal(student)}>
                    <Edit2 size={16} color="var(--text-secondary)" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  <label className="form-label">Roll Number</label>
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
                  <label className="form-label">Assigned Batch</label>
                  <select className="form-select" value={formData.batch} onChange={e => setFormData({...formData, batch: e.target.value})}>
                    <option value="SI Police Batch A">SI Police Batch A</option>
                    <option value="Constable Direct Batch">Constable Direct Batch</option>
                    <option value="Executive DSP Track">Executive DSP Track</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Enrolled Course</label>
                  <input type="text" className="form-input" value={formData.course} onChange={e => setFormData({...formData, course: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Course Fee (₹)</label>
                  <input type="number" className="form-input" required value={formData.fee} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Amount Paid Initially (₹)</label>
                  <input type="number" className="form-input" required value={formData.paid} onChange={e => setFormData({...formData, paid: Number(e.target.value)})} />
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
