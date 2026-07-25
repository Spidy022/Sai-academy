import React, { useState } from 'react';
import { BookOpen, MonitorPlay, CheckCircle, UploadCloud } from 'lucide-react';
import { saveCourse, saveBook } from '../firebase/firestore';

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('E-Books');
  const [formData, setFormData] = useState({ title: '', category: 'General Knowledge', link: '', isPremium: false, description: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (activeTab === 'E-Books') {
        await saveBook({
          title: formData.title,
          category: formData.category,
          pdfUrl: formData.link,
          isPremium: formData.isPremium,
          description: formData.description
        });
      } else if (activeTab === 'Courses') {
        await saveCourse({
          name: formData.title,
          description: formData.description,
          isPremium: formData.isPremium,
          duration: "Self-Paced",
          fee: formData.isPremium ? 5000 : 0
        });
      }
      setSuccess(true);
      setFormData({ title: '', category: 'General Knowledge', link: '', isPremium: false, description: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Content & Curriculum Management</h1>
      </div>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className={`btn ${activeTab === 'E-Books' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('E-Books')}
          >
            <BookOpen size={18} /> Digital Library (E-Books)
          </button>
          <button 
            className={`btn ${activeTab === 'Courses' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('Courses')}
          >
            <MonitorPlay size={18} /> Academy Courses & Modules
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <UploadCloud size={24} color="var(--primary)" />
          Upload New {activeTab === 'E-Books' ? 'E-Book / PDF' : 'Course Module'}
        </h2>
        
        {success && (
          <div style={{ background: 'var(--success-bg)', color: 'var(--success)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle size={18} />
            {activeTab} content successfully published to the platform!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2">
            <div className="form-group">
              <label className="form-label">{activeTab === 'E-Books' ? 'Book Title' : 'Course Name'}</label>
              <input type="text" className="form-input" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="Enter title..." />
            </div>
            
            {activeTab === 'E-Books' && (
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="form-select" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="General Knowledge">General Knowledge</option>
                  <option value="Law & Policing">Law & Policing</option>
                  <option value="Aptitude & Reasoning">Aptitude & Reasoning</option>
                  <option value="Current Affairs">Current Affairs</option>
                </select>
              </div>
            )}
            
            {activeTab === 'E-Books' && (
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">File Link (Google Drive / Firebase Storage URL)</label>
                <input type="url" className="form-input" required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." />
              </div>
            )}
            
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label className="form-label">Description / Syllabus Overview</label>
              <textarea className="form-textarea" rows="3" required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Brief overview of the content..."></textarea>
            </div>
          </div>

          <div style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
             <input 
               type="checkbox" 
               id="isPremium"
               style={{ width: '20px', height: '20px' }}
               checked={formData.isPremium} 
               onChange={e => setFormData({...formData, isPremium: e.target.checked})} 
             />
             <div>
               <label htmlFor="isPremium" style={{ fontWeight: 600, fontSize: '1rem', display: 'block', cursor: 'pointer' }}>Require Premium Access?</label>
               <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>If checked, this content will be hidden from guests and locked for students with pending fees.</span>
             </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Publishing...' : 'Publish Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentManager;
