import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import SideMenu from "./SideMenu";
import "./NavBar.css";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Hamburger icon is separated into a fixed overlay so it stays vertically on top of everything! */}
      <div
        className={`hamburger-menu ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        style={{ position: 'fixed', top: '15px', left: '25px', margin: 0 }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </div>

      <header className="navbar">
        {/* Placeholder keeps the visual spacing exactly intact since we extracted the button out for Z-index */}
        <div className="hamburger-placeholder" style={{ width: '48px', height: '48px', marginBottom: '2px', flexShrink: 0 }} />

        <nav className="nav-tabs">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            HOME
          </NavLink>

          <span className="separator">|</span>

          <NavLink
            to="/categories"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            CATEGORY
          </NavLink>

          <span className="separator">|</span>

          <NavLink
            to="/bookmarks"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            BOOKMARKS
          </NavLink>
        </nav>
      </header>
    </>
  );
};

export default NavBar;
