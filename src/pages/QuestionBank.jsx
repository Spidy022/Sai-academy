import React, { useState, useEffect } from 'react';
import { getBooks } from '../firebase/firestore';
import { Database, FileText, Download } from 'lucide-react';
import { useAuth } from '../firebase/auth';

const QuestionBank = () => {
  const { userProfile, isAdmin } = useAuth();
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTests = async () => {
      setLoading(true);
      const allMaterials = await getBooks();
      // Filter exactly for Question Bank mock tests
      const mockTests = allMaterials.filter(b => b.category === 'Question Bank (Mock Tests)');
      setTests(mockTests);
      setLoading(false);
    };
    fetchTests();
  }, []);

  const hasAccess = (test) => {
    if (isAdmin()) return true;
    if (test.isPremium && !userProfile?.premiumAccess) return false;
    return true; // Free test or user is premium
  };

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Database size={28} color="var(--primary)" />
          Question Bank & Mock Tests
        </h1>
      </div>

      <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>
        Access official Tamil Nadu Police exam mock papers, daily tests, and previous year question banks to prepare thoroughly for your SI and PC exams.
      </p>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading Question Bank...</div>
      ) : tests.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <FileText size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ color: 'var(--text-secondary)' }}>No Mock Tests Available</h3>
          <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>Administrators have not uploaded any mock tests yet.</p>
        </div>
      ) : (
        <div className="grid-cols-2">
          {tests.map(test => (
            <div key={test.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{test.title}</h3>
                  {test.isPremium ? (
                    <span className="badge badge-pending">Premium</span>
                  ) : (
                    <span className="badge badge-paid">Free Access</span>
                  )}
                </div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  {test.description || 'Daily mock test paper with answer key.'}
                </p>
              </div>
              
              <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                {hasAccess(test) ? (
                  <a href={test.pdfUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Download size={18} /> Download / View PDF
                  </a>
                ) : (
                  <button className="btn btn-secondary" style={{ width: '100%', opacity: 0.7 }} disabled>
                    Upgrade to Premium to Unlock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestionBank;
