import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RoleGuard from './components/RoleGuard';
import Login from './pages/Login';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import StudentManager from './pages/StudentManager';
import PaymentTracker from './pages/PaymentTracker';
import Settings from './pages/Settings';
import ContentManager from './pages/ContentManager';
import MyProfile from './pages/MyProfile';
import QuestionBank from './pages/QuestionBank';
import ContentGallery from './pages/ContentGallery';
import Enrollment from './pages/Enrollment';


function App() {
  // Initialize global theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Global scroll animations setup
  useEffect(() => {
    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        } else {
          // Remove class when scrolling out of view so it animates again when scrolling back
          entry.target.classList.remove('animate-in');
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

    const attachObservers = () => {
      document.querySelectorAll('.animate-on-scroll, .mount-animate').forEach((el) => {
        scrollObserver.observe(el);
      });
    };

    attachObservers();

    // Re-attach observers when new elements are added to DOM (like on route changes)
    const mutationObserver = new MutationObserver(() => {
      attachObservers();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      scrollObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<RoleGuard />}>
          <Route element={<Layout />}>
            {/* All Authenticated Roles (Guest/Student/Admin) */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Dynamic Content Views */}
            <Route path="/free-courses" element={<ContentGallery type="courses" requirePremium={false} />} />
            <Route path="/premium-courses" element={<ContentGallery type="courses" requirePremium={true} />} />
            <Route path="/links" element={<ContentGallery type="books" requirePremium={null} />} />
            <Route path="/ebooks" element={<ContentGallery type="books" requirePremium={null} />} />
            
            <Route path="/syllabus" element={<ContentGallery type="books" requirePremium={null} />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/enrollment" element={<Enrollment />} />
            <Route path="/payments" element={<PaymentTracker />} />
            <Route path="/profile" element={<MyProfile />} />
            
            {/* Admin Only Routes */}
            <Route element={<RoleGuard requireAdmin={true} />}>
              <Route path="/students" element={<StudentManager />} />
              <Route path="/content-manager" element={<ContentManager />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
