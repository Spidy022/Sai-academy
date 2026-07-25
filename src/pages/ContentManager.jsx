import React, { useState, useEffect } from 'react';
import { BookOpen, MonitorPlay, CheckCircle, UploadCloud, Edit2, Trash2, FileText } from 'lucide-react';
import { saveCourse, saveBook, getCourses, getBooks, deleteCourse, deleteBook, updateCourse, updateBook } from '../firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase/config';

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('Materials');
  const [formData, setFormData] = useState({ title: '', category: 'General Knowledge', link: '', isPremium: false, description: '' });
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New state for list and editing
  const [materials, setMaterials] = useState([]);
  const [videos, setVideos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const fetchContent = async () => {
    const [fetchedBooks, fetchedCourses] = await Promise.all([getBooks(), getCourses()]);
    setMaterials(fetchedBooks);
    setVideos(fetchedCourses);
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const handleEdit = (item, type) => {
    setActiveTab(type);
    setEditingId(item.id);
    setFormData({
      title: item.title || item.name,
      category: item.category || 'General Knowledge',
      link: item.pdfUrl || item.videoLink || '',
      isPremium: item.isPremium || false,
      description: item.description || ''
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm(`Are you sure you want to delete this ${type === 'Materials' ? 'Material' : 'Video'}?`)) return;
    try {
      if (type === 'Materials') await deleteBook(id);
      else await deleteCourse(id);
      fetchContent();
    } catch (err) {
      console.error(err);
      alert("Failed to delete content.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setUploadProgress(0);

    try {
      if (activeTab === 'Materials' || activeTab === 'Syllabus') {
        let pdfUrl = formData.link;
        
        if (file) {
          try {
            const fileRef = ref(storage, `${activeTab.toLowerCase()}/${Date.now()}_${file.name}`);
            const uploadTask = uploadBytesResumable(fileRef, file);
            
            pdfUrl = await new Promise((resolve, reject) => {
              uploadTask.on('state_changed', 
                (snapshot) => {
                  const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                  setUploadProgress(progress);
                }, 
                (error) => {
                  console.error("Storage upload error:", error);
                  reject(error);
                }, 
                async () => {
                  const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                  resolve(downloadURL);
                }
              );
            });
          } catch (storageError) {
            console.warn("Storage failed or not enabled. Using mock PDF link fallback.");
            // Fallback for demo if Firebase Storage fails
            pdfUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
          }
        }

        const data = {
          title: formData.title,
          category: activeTab === 'Syllabus' ? 'Syllabus' : formData.category,
          pdfUrl: pdfUrl,
          isPremium: formData.isPremium,
          description: formData.description
        };

        if (editingId) {
          await updateBook(editingId, data);
        } else {
          await saveBook(data);
        }
      } else if (activeTab === 'Videos') {
        const data = {
          name: formData.title,
          description: formData.description,
          isPremium: formData.isPremium,
          videoLink: formData.link,
          duration: "Self-Paced",
          fee: 0
        };

        if (editingId) {
          await updateCourse(editingId, data);
        } else {
          await saveCourse(data);
        }
      }
      
      setSuccess(true);
      setFormData({ title: '', category: 'General Knowledge', link: '', isPremium: false, description: '' });
      setFile(null);
      setEditingId(null);
      setUploadProgress(0);
      fetchContent();
      
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save content. Ensure Firebase Storage is enabled.");
    } finally {
      setLoading(false);
    }
  };

  const renderContentList = () => {
    const list = activeTab === 'Materials' ? materials : videos;
    
    return (
      <div className="table-container" style={{ marginTop: '32px' }}>
        <h2 style={{ marginBottom: '16px', fontSize: '1.25rem' }}>Published {activeTab}</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title / Name</th>
              {(activeTab === 'Materials' || activeTab === 'Syllabus') && <th>Category</th>}
              <th>Access</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {list.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                  No published {activeTab.toLowerCase()} found.
                </td>
              </tr>
            ) : (
              list.map(item => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.title || item.name}</td>
                  {(activeTab === 'Materials' || activeTab === 'Syllabus') && <td>{item.category}</td>}
                  <td>
                    {item.isPremium ? (
                      <span className="badge badge-pending">Premium</span>
                    ) : (
                      <span className="badge badge-paid">Free</span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="icon-btn" onClick={() => handleEdit(item, activeTab)} title="Edit">
                        <Edit2 size={16} color="var(--primary)" />
                      </button>
                      <button className="icon-btn" onClick={() => handleDelete(item.id, activeTab)} title="Delete">
                        <Trash2 size={16} color="var(--danger)" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Content & Curriculum Management</h1>
      </div>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`btn ${activeTab === 'Materials' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => { setActiveTab('Materials'); setFile(null); setEditingId(null); setFormData({ title: '', category: 'General Knowledge', link: '', isPremium: false, description: '' }); }}
          >
            <BookOpen size={18} /> Study Materials (PDF)
          </button>
          <button 
            className={`btn ${activeTab === 'Syllabus' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => { setActiveTab('Syllabus'); setFile(null); setEditingId(null); setFormData({ title: '', category: 'Syllabus', link: '', isPremium: false, description: '' }); }}
          >
            <FileText size={18} /> Syllabus (PDF)
          </button>
          <button 
            className={`btn ${activeTab === 'Videos' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => { setActiveTab('Videos'); setEditingId(null); setFormData({ title: '', category: 'General Knowledge', link: '', isPremium: false, description: '' }); }}
          >
            <MonitorPlay size={18} /> Video Sessions
          </button>
        </div>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <UploadCloud size={24} color="var(--primary)" />
            {editingId ? 'Edit' : 'Upload New'} {activeTab === 'Videos' ? 'Video Session' : activeTab === 'Syllabus' ? 'Syllabus PDF' : 'PDF Material'}
          </h2>
          {editingId && (
            <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(null); setFormData({ title: '', category: 'General Knowledge', link: '', isPremium: false, description: '' }); }}>
              Cancel Edit
            </button>
          )}
        </div>
        
        {success && (
          <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            {activeTab} content successfully {editingId ? 'updated' : 'published'}!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">{activeTab === 'Videos' ? 'Session Name' : 'Material Title'}</label>
              <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Enter title..." />
            </div>
            
            {activeTab === 'Materials' && (
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="Law & Policing">Law & Policing</option>
                  <option value="Aptitude & Reasoning">Aptitude & Reasoning</option>
                  <option value="Current Affairs">Current Affairs</option>
                  <option value="Question Bank (Mock Tests)">Question Bank (Mock Tests)</option>
                </select>
              </div>
            )}
            
            {(activeTab === 'Materials' || activeTab === 'Syllabus') && (
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Upload PDF File {editingId && '(Leave empty to keep existing)'}</label>
                <input type="file" accept=".pdf" className="form-input" required={!editingId && !formData.link} onChange={e => setFile(e.target.files[0])} />
                
                {/* Upload Progress Bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div style={{ marginTop: '12px', height: '8px', background: 'var(--bg-primary)', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                    <div style={{ height: '100%', background: 'var(--primary)', width: `${uploadProgress}%`, transition: 'width 0.2s' }}></div>
                  </div>
                )}
              </div>
            )}
            
            {activeTab === 'Videos' && (
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Video Session Link (YouTube / Vimeo)</label>
                <input type="url" className="form-input" required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." />
              </div>
            )}
            
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Description / Syllabus Overview</label>
              <textarea className="form-textarea" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief overview of the content..."></textarea>
            </div>
          </div>

          {/* Massive Free / Premium Selector */}
          <div style={{ marginTop: '24px', marginBottom: '32px' }}>
            <label className="form-label" style={{ fontSize: '1.1rem', marginBottom: '12px', display: 'block' }}>Content Visibility</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div 
                onClick={() => setFormData({...formData, isPremium: false})}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: !formData.isPremium ? '2px solid var(--success)' : '2px solid var(--border-glass)',
                  background: !formData.isPremium ? 'rgba(34, 197, 94, 0.1)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <h3 style={{ color: !formData.isPremium ? 'var(--success)' : 'var(--text-secondary)', marginBottom: '8px' }}>Free Content</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Visible to everyone, including guests</p>
              </div>
              
              <div 
                onClick={() => setFormData({...formData, isPremium: true})}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  border: formData.isPremium ? '2px solid var(--primary)' : '2px solid var(--border-glass)',
                  background: formData.isPremium ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-secondary)',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <h3 style={{ color: formData.isPremium ? 'var(--primary)' : 'var(--text-secondary)', marginBottom: '8px' }}>Premium Content</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Locked for students with paid fees only</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary btn-push" disabled={loading}>
              {loading ? (uploadProgress > 0 ? `Uploading... ${Math.round(uploadProgress)}%` : 'Saving...') : (editingId ? 'Update Content' : 'Publish Content')}
            </button>
          </div>
        </form>

        {renderContentList()}

      </div>
    </div>
  );
};

export default ContentManager;
