import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import RoleGuard from './components/RoleGuard';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import StudentManager from './pages/StudentManager';
import PaymentTracker from './pages/PaymentTracker';
import Settings from './pages/Settings';

// Placeholders for remaining pages
const AttendanceRegister = () => <div className="glass-card"><h2>Attendance Register</h2><p>Coming soon...</p></div>;
const StudyMaterials = () => <div className="glass-card"><h2>Study Materials</h2><p>Coming soon...</p></div>;
const VideoLectures = () => <div className="glass-card"><h2>Video Lectures</h2><p>Coming soon...</p></div>;
const Notices = () => <div className="glass-card"><h2>Notices</h2><p>Coming soon...</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes Wrapper */}
        <Route element={<RoleGuard />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/payments" element={<PaymentTracker />} />
            <Route path="/materials" element={<StudyMaterials />} />
            <Route path="/videos" element={<VideoLectures />} />
            <Route path="/notices" element={<Notices />} />
            
            {/* Admin Only Routes */}
            <Route element={<RoleGuard requireAdmin={true} />}>
              <Route path="/students" element={<StudentManager />} />
              <Route path="/attendance" element={<AttendanceRegister />} />
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
