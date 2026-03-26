import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import CategoryCard from "../components/CategoryCard";
import ArticleCard from "../components/ArticleCard";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../utils/api";
import "./CategoryPage.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryArticles, setCategoryArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState([]);

  const { token, showToast } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiFetch("/api/categories");
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchUserBookmarks = async () => {
      if (!token) {
        setBookmarkedIds([]);
        return;
      }
      try {
        const data = await apiFetch("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookmarkedIds(data.bookmarks.map(b => b._id));
      } catch (err) {
        console.error("Failed to fetch user bookmarks", err);
      }
    };
    fetchUserBookmarks();
  }, [token]);

  const toggleBookmark = async (articleId) => {
    if (!token) {
      showToast("Please login or register to bookmark articles.", "error");
      return;
    }

    try {
      const data = await apiFetch(`/api/users/bookmarks/${articleId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const isNowBookmarked = data.isBookmarked;
      if (isNowBookmarked) {
        setBookmarkedIds(prev => [...prev, articleId]);
      } else {
        setBookmarkedIds(prev => prev.filter(id => id !== articleId));
      }
      showToast(data.message, "success");
    } catch (err) {
      console.error("Bookmark toggle failed", err);
      showToast(err.message || "Failed to update bookmark", "error");
    }
  };

  const handleCategoryClick = async (categoryObj) => {
    setSelectedCategory(categoryObj);
    setLoadingArticles(true);
    try {
      const data = await apiFetch(`/api/articles?category=${encodeURIComponent(categoryObj.name)}`);
      setCategoryArticles(data);
    } catch (err) {
      console.error("Failed to fetch categorized articles", err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const ageOrder = ["infant", "toddler", "preschool", "school", "teen"];
  const ageGroups = categories
    .filter((c) => c.type === "Age Group")
    .sort((a, b) => {
      const indexA = ageOrder.findIndex((key) => a.name.toLowerCase().includes(key));
      const indexB = ageOrder.findIndex((key) => b.name.toLowerCase().includes(key));
      return indexA - indexB;
    });
  const topics = categories.filter((c) => c.type === "Topic");

  return (
    <div className="category-page-container">
      <NavBar />

      <main className="category-page-content">
        {selectedCategory ? (
          <div className="category-articles-section">
            <button
              className="back-btn"
              onClick={() => setSelectedCategory(null)}
            >
              &larr; Back to Categories
            </button>
            <h2 className="section-title">Articles in {selectedCategory.name}</h2>
            {loadingArticles ? (
              <p className="loading-text">Loading articles...</p>
            ) : categoryArticles.length > 0 ? (
              <div className="category-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                {categoryArticles.map(article => (
                  <ArticleCard 
                    key={article._id} 
                    article={article} 
                    isBookmarked={bookmarkedIds.includes(article._id)}
                    onBookmarkToggle={toggleBookmark}
                  />
                ))}
              </div>
            ) : (
              <p>No articles found for this category.</p>
            )}
          </div>
        ) : (
          <>
            <h2 className="section-title">Filter by age</h2>
            <div className="age-group-container">
              {ageGroups.map(age => (
                <button key={age._id} className="age-pill" onClick={() => handleCategoryClick(age)}>
                  {age.name}
                </button>
              ))}
            </div>

            <h2 className="section-title mt-40">Explore by topic</h2>
            {loading ? (
              <p className="loading-text">Loading categories...</p>
            ) : (
              <section className="category-grid">
                {topics.map(topic => (
                  <CategoryCard key={topic._id} category={topic} onClick={() => handleCategoryClick(topic)} />
                ))}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;


