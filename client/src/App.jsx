import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage"; // We will build this next!
import CategoryPage from "./pages/CategoryPage";
import BookmarksPage from "./pages/BookmarkPage";
// Admin Pages
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminArticles from "./pages/Admin/AdminArticles";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminUsers from "./pages/Admin/AdminUsers";

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

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
