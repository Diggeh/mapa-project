import React from "react";
import NavBar from "../components/navBar";
// We can reuse the LandingPage CSS for the layout containers!
import "./LandingPage.css";

const CategoryPage = () => {
  return (
    <div className="landing-container">
      <NavBar />

      {/* Reusing the beige box layout */}
      <main
        className="main-content"
        style={{ minHeight: "50vh", justifyContent: "center" }}
      >
        <h1 style={{ color: "#333" }}>Categories</h1>
        <p style={{ color: "#777" }}>
          This is where the category filters will go!
        </p>
      </main>
    </div>
  );
};

export default CategoryPage;
