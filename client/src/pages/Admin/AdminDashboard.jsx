import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ users: 0, articles: 0, categories: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token') || '';
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Use Promise.all to fetch concurrently
        const [users, articles, categories] = await Promise.all([
          apiFetch('/api/admin/users', { headers }),
          apiFetch('/api/articles'),
          apiFetch('/api/categories')
        ]);
        
        setStats({
          users: users.length || 0,
          articles: articles.length || 0,
          categories: categories.length || 0
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome to the MAPA Content & User Management Portal.</p>
      </header>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-value">{loading ? '...' : stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Total Articles</h3>
          <p className="stat-value">{loading ? '...' : stats.articles}</p>
        </div>
        <div className="stat-card">
          <h3>Total Categories</h3>
          <p className="stat-value">{loading ? '...' : stats.categories}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
