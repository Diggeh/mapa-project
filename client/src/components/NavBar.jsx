import React from "react";
import { NavLink } from "react-router-dom"; // 1. Import NavLink from react-router-dom
import "./NavBar.css";

const NavBar = () => {
  return (
    <header className="navbar">
      <div className="hamburger-menu">
        <span className="hamburger-icon">☰</span>
      </div>

      <nav className="nav-tabs">
        {/* 2. Replace <button> with <NavLink> */}
        {/* The className takes a function that checks if this specific link is active */}
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
  );
};

export default NavBar;
