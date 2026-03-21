import React from "react";
import NavBar from "../components/navBar";
import "./LandingPage.css";

const BookmarksPage = () => {
  return (
    <div className="landing-container">
      <NavBar />

      <main
        className="main-content"
        style={{ minHeight: "50vh", justifyContent: "center" }}
      >
        <h1 style={{ color: "#333" }}>Your Bookmarks</h1>
        <p style={{ color: "#777" }}>Saved articles will appear here.</p>
      </main>
    </div>
  );
};

export default BookmarksPage;
