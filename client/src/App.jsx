import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; // We will build this next!
import CategoryPage from "./pages/CategoryPage";
import BookmarksPage from "./pages/BookmarkPage";
// import ArticlePage from './ArticlePage'; // We will build this next!

function App() {
  return (
    <Router>
      <Routes>
        {/* Your Main Feed */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />

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
