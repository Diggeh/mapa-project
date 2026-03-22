import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/NavBar";
import CategoryCard from "../components/CategoryCard";
import ArticleCard from "../components/ArticleCard";
import "./CategoryPage.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryArticles, setCategoryArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/categories");
        setCategories(response.data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = async (categoryObj) => {
    setSelectedCategory(categoryObj);
    setLoadingArticles(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/articles?category=${encodeURIComponent(categoryObj.name)}`);
      setCategoryArticles(response.data);
    } catch (err) {
      console.error("Failed to fetch categorized articles", err);
    } finally {
      setLoadingArticles(false);
    }
  };

  const ageGroups = categories.filter(c => c.type === "Age Group");
  const topics = categories.filter(c => c.type === "Topic");

  return (
    <div className="category-page-container">
      <NavBar />

      <main className="category-page-content">
        {selectedCategory ? (
          <div className="category-articles-section">
            <button 
              className="back-btn" 
              onClick={() => setSelectedCategory(null)}
              style={{ marginBottom: "20px", padding: "10px 20px", cursor: "pointer", background: "none", border: "1px solid #ccc", borderRadius: "5px" }}
            >
              &larr; Back to Categories
            </button>
            <h2 className="section-title">Articles in {selectedCategory.name}</h2>
            {loadingArticles ? (
              <p className="loading-text">Loading articles...</p>
            ) : categoryArticles.length > 0 ? (
              <div className="category-grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
                {categoryArticles.map(article => (
                  <ArticleCard key={article._id} article={article} />
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


