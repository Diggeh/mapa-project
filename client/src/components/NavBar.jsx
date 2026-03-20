import React from "react";
import "./NavBar.css"; // We will create this next

const NavBar = () => {
  return (
    <header className="navbar">
      <div className="hamburger-menu">
        <span className="hamburger-icon">☰</span>
      </div>
      <nav className="nav-tabs">
        <button className="tab active">HOME</button>
        <button className="tab">FOR YOU</button>
        <button className="tab">CATEGORY</button>
        <button className="tab">BOOKMARKS</button>
      </nav>
    </header>
  );
};

export default NavBar;
