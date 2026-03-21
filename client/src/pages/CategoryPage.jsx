import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../components/navBar";
import CategoryCard from "../components/CategoryCard";
import "./CategoryPage.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const ageGroups = categories.filter(c => c.type === "Age Group");
  const topics = categories.filter(c => c.type === "Topic");

  return (
    <div className="category-page-container">
      <NavBar />

      <main className="category-page-content">
        <h2 className="section-title">Filter by age</h2>
        <div className="age-group-container">
          {ageGroups.map(age => (
            <button key={age._id} className="age-pill">
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
              <CategoryCard key={topic._id} category={topic} />
            ))}
          </section>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;


