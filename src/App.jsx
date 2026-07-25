import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RoleGuard from './components/RoleGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentManager from './pages/StudentManager';
import PaymentTracker from './pages/PaymentTracker';
import Settings from './pages/Settings';
import ContentManager from './pages/ContentManager';
import MyProfile from './pages/MyProfile';
import QuestionBank from './pages/QuestionBank';

// Placeholders for new Phase 2 Content Pages
const FreeCourses = () => <div className="glass-card"><h2>Free Courses</h2><p>Accessible to all verified guests and students.</p></div>;
const PremiumCourses = () => <div className="glass-card"><h2>Paid Courses</h2><p>Premium modules unlocked after payment.</p></div>;
const Links = () => <div className="glass-card"><h2>Links</h2><p>Important external resources.</p></div>;
const EBooks = () => <div className="glass-card"><h2>Digital E-book Library</h2><p>Download PDFs and study material here.</p></div>;
const Syllabus = () => <div className="glass-card"><h2>Course Syllabus</h2><p>Curriculum outlines for active batches.</p></div>;
const AttendanceRegister = () => <div className="glass-card"><h2>Attendance Register</h2><p>Batch attendance tracking module.</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<RoleGuard />}>
          <Route element={<Layout />}>
            {/* All Authenticated Roles (Guest/Student/Admin) */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/free-courses" element={<FreeCourses />} />
            <Route path="/premium-courses" element={<PremiumCourses />} />
            <Route path="/links" element={<Links />} />
            <Route path="/ebooks" element={<EBooks />} />
            <Route path="/syllabus" element={<Syllabus />} />
            <Route path="/question-bank" element={<QuestionBank />} />
            <Route path="/payments" element={<PaymentTracker />} />
            <Route path="/profile" element={<MyProfile />} />
            
            {/* Admin Only Routes */}
            <Route element={<RoleGuard requireAdmin={true} />}>
              <Route path="/students" element={<StudentManager />} />
              <Route path="/attendance" element={<AttendanceRegister />} />
              <Route path="/content-manager" element={<ContentManager />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
