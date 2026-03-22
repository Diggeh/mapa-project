import React, { useState, useEffect } from 'react';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceLink, setSourceLink] = useState('');
  const [authorsStr, setAuthorsStr] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [region, setRegion] = useState('International');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [pdfFile, setPdfFile] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [artRes, catRes] = await Promise.all([
        fetch('http://localhost:5000/api/articles'),
        fetch('http://localhost:5000/api/categories')
      ]);
      
      if (!artRes.ok || !catRes.ok) throw new Error('Failed to fetch data');
      
      const artData = await artRes.json();
      const catData = await catRes.json();
      
      setArticles(artData);
      setCategories(catData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setTitle('');
    setContent('');
    setSourceLink('');
    setAuthorsStr('');
    setPublishedDate('');
    setRegion('International');
    setSelectedCategories([]);
    setPdfFile(null);
    setShowModal(true);
  };

  const openEditModal = (art) => {
    setIsEditing(true);
    setCurrentId(art._id);
    setTitle(art.title);
    setContent(art.content);
    setSourceLink(art.sourceLink);
    setAuthorsStr(art.authors?.join(', ') || '');
    setPublishedDate(art.publishedDate ? art.publishedDate.split('T')[0] : '');
    setRegion(art.region || 'International');
    setSelectedCategories(art.category || []);
    setPdfFile(null); // Keep null unless user uploads a new one
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this article?")) return;
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`http://localhost:5000/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete article');
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || '';
      const url = isEditing 
        ? `http://localhost:5000/api/admin/articles/${currentId}` 
        : 'http://localhost:5000/api/admin/articles';
      const method = isEditing ? 'PUT' : 'POST';
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('sourceLink', sourceLink);
      formData.append('authors', authorsStr);
      formData.append('region', region);
      formData.append('category', selectedCategories.join(','));
      if (publishedDate) formData.append('publishedDate', publishedDate);
      if (pdfFile) formData.append('pdfFile', pdfFile);

      const res = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}` // Note: NO Content-Type header for FormData, browser sets it
        },
        body: formData
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Failed to save article');
      }
      
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleCategoryChange = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedCategories(value);
  };

  return (
    <div className="admin-page admin-articles">
      <header className="admin-header">
        <div>
          <h1>Article Management</h1>
          <p>Add, edit, or remove map research articles</p>
        </div>
        <button className="btn-primary" onClick={openAddModal}>+ Add New Article</button>
      </header>
      
      {error && <div className="admin-error">{error}</div>}
      
      <div className="admin-table-container">
        {loading ? (
          <p className="admin-loading">Loading articles...</p>
        ) : (
          <div style={{overflowX: 'auto'}}>
            <table className="admin-table" style={{minWidth: '800px'}}>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Region</th>
                  <th>Date Adding</th>
                  <th className="action-col">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{textAlign: 'center', padding: '2rem'}}>No articles found. Click Add New to start.</td>
                  </tr>
                ) : (
                  articles.map(art => (
                    <tr key={art._id}>
                      <td className="font-medium text-white">{art.title}</td>
                      <td>
                        <span className={`badge badge-${art.region === 'Local' ? 'topic' : 'age'}`}>
                          {art.region || 'International'}
                        </span>
                      </td>
                      <td>{new Date(art.createdAt).toLocaleDateString()}</td>
                      <td className="table-actions">
                        <button className="btn-icon edit" onClick={() => openEditModal(art)}>Edit</button>
                        <button className="btn-icon delete" onClick={() => handleDelete(art._id)}>Delete</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal" style={{maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto'}} onClick={e => e.stopPropagation()}>
            <h2>{isEditing ? 'Edit Article' : 'Add New Article'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div className="form-group">
                  <label>Title</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Source Link (URL / DOI)</label>
                  <input type="text" value={sourceLink} onChange={e => setSourceLink(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Authors (comma-separated)</label>
                  <input type="text" value={authorsStr} onChange={e => setAuthorsStr(e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Published Date</label>
                  <input type="date" value={publishedDate} onChange={e => setPublishedDate(e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Region</label>
                  <select value={region} onChange={e => setRegion(e.target.value)} required>
                    <option value="Local">Local</option>
                    <option value="International">International</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Categories (Multiselect)</label>
                  <select multiple value={selectedCategories} onChange={handleCategoryChange} required style={{height: '100px'}}>
                    {categories.map(c => (
                      <option key={c._id} value={c.name}>{c.name} ({c.type})</option>
                    ))}
                  </select>
                  <small style={{color: 'var(--admin-text-muted)'}}>Hold Ctrl/Cmd to select multiple</small>
                </div>
              </div>
              
              <div className="form-group" style={{marginTop: '1rem'}}>
                <label>Main Content (Summary)</label>
                <textarea rows="4" value={content} onChange={e => setContent(e.target.value)} required></textarea>
              </div>

              <div className="form-group">
                <label>PDF File Upload</label>
                <input type="file" accept="application/pdf" onChange={e => setPdfFile(e.target.files[0])} />
                {isEditing && !pdfFile && <small style={{color: '#93c5fd'}}>Leave empty to keep existing PDF</small>}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Article</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminArticles;
