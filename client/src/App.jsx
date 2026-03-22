import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage"; // We will build this next!
import CategoryPage from "./pages/CategoryPage";
import BookmarksPage from "./pages/BookmarkPage";
import ArticlePage from "./pages/ArticlePage";
// Admin Pages
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminArticles from "./pages/Admin/AdminArticles";
import AdminCategories from "./pages/Admin/AdminCategories";
import AdminUsers from "./pages/Admin/AdminUsers";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
        {/* Your Main Feed */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/categories" element={<CategoryPage />} />
        <Route path="/bookmarks" element={<BookmarksPage />} />

        {/* Your Reusable Template Page */}
        <Route path="/article/:id" element={<ArticlePage />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="articles" element={<AdminArticles />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default App;
