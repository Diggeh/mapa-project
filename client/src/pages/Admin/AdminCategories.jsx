import React, { useState, useEffect } from 'react';
import { apiFetch } from '../../utils/api';
import './AdminCategories.css';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [name, setName] = useState('');
  const [type, setType] = useState('Topic');

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await apiFetch('/api/categories');
      setCategories(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setName('');
    setType('Topic');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setIsEditing(true);
    setCurrentId(cat._id);
    setName(cat.name);
    setType(cat.type);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    try {
      // Assuming token is saved in localStorage. Update as per auth setup.
      const token = localStorage.getItem('token') || '';
      await apiFetch(`/api/admin/categories/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      const endpoint = isEditing 
        ? `/api/admin/categories/${currentId}` 
        : '/api/admin/categories';
      const method = isEditing ? 'PUT' : 'POST';
      
      await apiFetch(endpoint, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, type })
      });
      
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="admin-page admin-categories">
      <header className="admin-header">
        <div>
          <h1>Category Management</h1>
          <p>Organize articles by Age Groups and Topics</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>+ Add New Category</button>
      </header>
      
      {error && <div className="admin-error">{error}</div>}
      
      <div className="admin-table-container">
        {loading ? (
          <p className="admin-loading">Loading categories...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th className="action-col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{textAlign: 'center', padding: '2rem'}}>No categories found. Click Add New to start.</td>
                </tr>
              ) : (
                categories.map(cat => (
                  <tr key={cat._id}>
                    <td className="font-medium text-white">{cat.name}</td>
                    <td>
                      <span className={`badge badge-${cat.type === 'Age Group' ? 'age' : 'topic'}`}>
                        {cat.type}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button className="btn-icon edit" onClick={() => openEditModal(cat)}>Edit</button>
                      <button className="btn-icon delete" onClick={() => handleDelete(cat._id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h2>{isEditing ? 'Edit Category' : 'Add New Category'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                  placeholder="e.g., Toddlers or Meltdowns"
                />
              </div>
              <div className="form-group">
                <label>Category Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} required>
                  <option value="Topic">Topic</option>
                  <option value="Age Group">Age Group</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
