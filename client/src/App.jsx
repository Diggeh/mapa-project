import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; // We will build this next!
// import ArticlePage from './ArticlePage'; // We will build this next!

function App() {
  return (
    <Router>
      <Routes>
        {/* Your Main Feed */}
        <Route path="/" element={<LandingPage />} />

        {/* Your Reusable Template Page */}
        {/* The ":id" is a variable. It catches /article/1, /article/abc, etc. */}
        <Route
          path="/article/:id"
          element={<div>Placeholder for Article Page Template</div>}
        />
      </Routes>
    </Router>
  );
}

export default App;
