import React from 'react';
import { NavLink } from 'react-router-dom';
import './AdminSidebar.css';

const AdminSidebar = () => {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <h2>MAPA Admin</h2>
      </div>
      <nav className="admin-nav">
        <NavLink to="/admin" end className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Overview</NavLink>
        <NavLink to="/admin/articles" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Articles</NavLink>
        <NavLink to="/admin/categories" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Categories</NavLink>
        <NavLink to="/admin/users" className={({isActive}) => isActive ? "sidebar-link active" : "sidebar-link"}>Users</NavLink>
      </nav>
      <div className="admin-footer">
        <NavLink to="/" className="sidebar-link return-home">← Back to Site</NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;
