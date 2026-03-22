import React from "react";
import { useAuth } from "../context/AuthContext";
import "./SideMenu.css";
import mapaLogoOcean from "../assets/Mapa-logo-ocean.png";

const SideMenu = ({ isOpen, onClose, onOpenAuth }) => {
  const { user, logout } = useAuth();
  return (
    <>
      <div 
        className={`side-menu-overlay ${isOpen ? "open" : ""}`} 
        onClick={onClose}
      />
      
      <div className={`side-menu-panel ${isOpen ? "open" : ""}`}>
        <div className="side-menu-header">
          {/* Logo with ocean color variant */}
          <img src={mapaLogoOcean} alt="MAPA Logo" className="side-menu-logo" />
        </div>
        
        <div className="side-menu-content">
          <h4 className="side-menu-section-title">Settings</h4>
          
          <ul className="side-menu-links">
            <li className="side-menu-link active">
              Your account
            </li>
            <li className="side-menu-link">
              Notifications
            </li>
            <li className="side-menu-link">
              Settings
            </li>
          </ul>
        </div>
        
        <div className="side-menu-footer">
          {user ? (
            <>
              <div className="user-avatar-placeholder">
                {user.email ? user.email.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="user-email" style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.email}
              </span>
              <button className="logout-btn" aria-label="Log Out" onClick={() => { logout(); onClose(); }}>
                <span style={{ fontSize: "20px" }}>⎘</span>
              </button>
            </>
          ) : (
            <>
              <div className="user-avatar-placeholder">?</div>
              <span className="user-email">Please Login</span>
              <button className="logout-btn" aria-label="Log In" onClick={() => { onClose(); onOpenAuth(); }}>
                <span style={{ fontSize: "20px" }}>➔</span>
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenu;
