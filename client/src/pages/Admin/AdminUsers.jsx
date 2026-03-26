import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token') || '';
      const data = await apiFetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem('token') || '';
      await apiFetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ role: newRole })
      });
      // Update local state without re-fetching
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.message);
      fetchUsers(); // Revert back on error
    }
  };

  return (
    <div className="admin-page admin-users">
      <header className="admin-header">
        <div>
          <h1>User Management</h1>
          <p>View registered users and manage their admin privileges</p>
        </div>
      </header>
      
      {error && <div className="admin-error">{error}</div>}
      
      <div className="admin-table-container">
        {loading ? (
          <p className="admin-loading">Loading users...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
                <th>Joined Date</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '2rem'}}>No users found.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user._id}>
                    <td className="font-medium text-white">{user.email}</td>
                    <td>
                      <select 
                        value={user.role} 
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className="role-select"
                        style={{
                          background: 'rgba(15, 23, 42, 0.6)', 
                          color: 'white', 
                          border: '1px solid var(--admin-border)',
                          padding: '0.4rem',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
