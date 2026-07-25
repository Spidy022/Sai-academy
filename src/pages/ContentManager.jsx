import React, { useState } from 'react';
import { BookOpen, MonitorPlay, CheckCircle, UploadCloud } from 'lucide-react';
import { saveCourse, saveBook } from '../firebase/firestore';

const ContentManager = () => {
  const [activeTab, setActiveTab] = useState('Materials');
  const [formData, setFormData] = useState({ title: '', category: 'General Knowledge', link: '', isPremium: false, description: '' });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      if (activeTab === 'Materials') {
        await saveBook({
          title: formData.title,
          category: formData.category,
          pdfUrl: formData.link,
          isPremium: formData.isPremium,
          description: formData.description
        });
      } else if (activeTab === 'Videos') {
        await saveCourse({
          name: formData.title,
          description: formData.description,
          isPremium: formData.isPremium,
          videoLink: formData.link,
          duration: "Self-Paced",
          fee: 0
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
            className={`btn ${activeTab === 'Materials' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('Materials')}
          >
            <BookOpen size={18} /> Study Materials (PDF)
          </button>
          <button 
            className={`btn ${activeTab === 'Videos' ? 'btn-primary' : 'btn-secondary'}`} 
            onClick={() => setActiveTab('Videos')}
          >
            <MonitorPlay size={18} /> Video Sessions
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <UploadCloud size={24} color="var(--primary)" />
          Upload New {activeTab === 'Materials' ? 'PDF Material' : 'Video Session'}
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
              <label className="form-label">{activeTab === 'Materials' ? 'Material Title' : 'Session Name'}</label>
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
                </select>
              </div>
            )}
            
            {activeTab === 'Materials' && (
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">File Link (Google Drive / Firebase Storage URL)</label>
                <input type="url" className="form-input" required value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} placeholder="https://..." />
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
