import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../firebase/auth';

const RoleGuard = ({ requireAdmin = false }) => {
  const { currentUser, isAdmin, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="app-container" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};

export default RoleGuard;
