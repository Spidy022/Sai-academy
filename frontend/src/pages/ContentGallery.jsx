import React, { useState, useEffect } from 'react';
import { getBooks, getCourses } from '../firebase/firestore';
import { useAuth } from '../firebase/auth';
import { BookOpen, MonitorPlay, Lock, Search, Download, ExternalLink } from 'lucide-react';

const ContentGallery = ({ type = 'books', requirePremium = false }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { userProfile, isAdmin } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let data = type === 'books' ? await getBooks() : await getCourses();
      
      // Filter based on premium requirement if specified
      if (requirePremium !== null) {
        data = data.filter(item => Boolean(item.isPremium) === Boolean(requirePremium));
      }
      
      setItems(data);
      setLoading(false);
    };
    fetchData();
  }, [type, requirePremium]);

  const hasAccess = (item) => {
    if (isAdmin()) return true;
    if (!item.isPremium) return true;
    return userProfile && userProfile.feeStatus === 'PAID';
  };

  const filteredItems = items.filter(item => 
    (item.title || item.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {type === 'books' ? <BookOpen size={28} color="var(--primary)" /> : <MonitorPlay size={28} color="var(--primary)" />}
          {requirePremium ? 'Premium ' : (requirePremium === false ? 'Free ' : '')}
          {type === 'books' ? 'Study Materials & PDFs' : 'Video Sessions'}
        </h1>
      </div>

      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-input" 
            placeholder="Search resources..." 
            style={{ paddingLeft: '40px' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
          <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading resources...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h2 style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>No content found</h2>
          <p style={{ color: 'var(--text-muted)' }}>Check back later or try a different search term.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {filteredItems.map(item => {
            const userHasAccess = hasAccess(item);
            
            return (
              <div key={item.id} className="glass-card mount-animate delay-1" style={{ display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
                {item.isPremium && (
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--warning-bg)', color: 'var(--warning)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={12} /> PREMIUM
                  </div>
                )}
                
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', paddingRight: item.isPremium ? '80px' : '0' }}>
                  {item.title || item.name}
                </h3>
                
                {item.category && (
                  <span style={{ display: 'inline-block', background: 'var(--bg-secondary)', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', alignSelf: 'flex-start' }}>
                    {item.category}
                  </span>
                )}
                
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px', flex: 1 }}>
                  {item.description || 'No description provided.'}
                </p>
                
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                  {userHasAccess ? (
                    <a 
                      href={item.pdfUrl || item.videoLink || '#'} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary btn-bounce" 
                      style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                    >
                      {type === 'books' ? <><Download size={16} /> Download PDF</> : <><ExternalLink size={16} /> Watch Video</>}
                    </a>
                  ) : (
                    <button className="btn btn-secondary" style={{ width: '100%', opacity: 0.7, cursor: 'not-allowed' }} disabled>
                      <Lock size={16} /> Pay Fees to Unlock
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ContentGallery;
