import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import SideMenu from "./SideMenu";
import "./NavBar.css";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      
      <header className="navbar">
        <div 
          className={`hamburger-menu ${isMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="hamburger-icon">☰</span>
        </div>

        <nav className="nav-tabs">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            HOME
          </NavLink>

          <span className="separator">|</span>

          <NavLink
            to="/for-you"
            className={({ isActive }) => (isActive ? "tab active" : "tab")}
          >
            FOR YOU
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
