import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../utils/api';
import './AuthModal.css';

const AuthModal = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Defaulting to user role explicitly on register since admin should only be granted by other admins
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    try {
      const data = await apiFetch(endpoint, {
        method: 'POST',
        body: JSON.stringify({ email, password, role: 'user' }) 
      });
      
      if (isLogin) {
        // Backend login returns { token, user: { id, email, role } }
        login(data.token, data.user);
        
        // Redirect to admin dashboard if the user is an admin
        if (data.user.role === 'admin') {
          navigate('/admin');
        }
        
        onClose();
      } else {
        // Registration success, switch to login tab
        // Backend only sends { message: "User registered..." }
        setIsLogin(true);
        setError("Registration successful! Please log in.");
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={e => e.stopPropagation()}>
        <button className="auth-close-btn" onClick={onClose}>&times;</button>
        <div className="auth-tabs">
          <button className={isLogin ? "auth-tab active" : "auth-tab"} onClick={() => {setIsLogin(true); setError(null);}}>Login</button>
          <button className={!isLogin ? "auth-tab active" : "auth-tab"} onClick={() => {setIsLogin(false); setError(null);}}>Sign Up</button>
        </div>
        
        <h2>{isLogin ? "Welcome Back" : "Create an Account"}</h2>
        {error && <div className={`auth-message ${error.includes('successful') ? 'success' : 'error'}`}>{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
              placeholder="name@example.com" 
            />
          </div>
          <div className="auth-form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              placeholder="••••••••" 
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Processing..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
