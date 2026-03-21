import React from "react";
import NavBar from "../components/navBar";

const TestPage = () => {
  return (
    <div className="test-page">
      <NavBar />
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h1>Test Page</h1>
        <p>This is a blank page with the NavBar component.</p>
      </main>
    </div>
  );
};

export default TestPage;
