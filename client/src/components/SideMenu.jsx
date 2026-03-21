import React from "react";
import "./SideMenu.css";
import mapaLogoOcean from "../assets/Mapa-logo-ocean.png";

const SideMenu = ({ isOpen, onClose }) => {
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
          <div className="user-avatar-placeholder">F</div>
          <span className="user-email">placeholder@gmail.com</span>
          <button className="logout-btn" aria-label="Log Out">
            <span style={{ fontSize: "20px" }}>⎘</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default SideMenu;
