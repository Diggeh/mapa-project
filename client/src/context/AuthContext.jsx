import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    if (token) {
      try {
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr);
        
        // Ensure the token isn't expired
        if (payload.exp * 1000 < Date.now()) {
          logout();
        } else {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser({ id: payload.id, role: payload.role });
          }
        }
      } catch (err) {
        logout();
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const login = (newToken, userData) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setToken(newToken);
    setUser(userData);
    showToast(`Welcome back, ${userData.email.split('@')[0]}!`, 'success');
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    showToast('You have been logged out out successfully.', 'success');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, showToast }}>
      {!loading && children}
      {toast && (
        <div className={`global-toast ${toast.type}`}>
          {toast.message}
        </div>
      )}
    </AuthContext.Provider>
  );
};
