import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import AdminSidebar from './AdminSidebar';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="admin-loading" style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center'}}>Loading access...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/" replace />;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
