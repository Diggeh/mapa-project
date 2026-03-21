import React from "react";
import NavBar from "../components/navBar";
import CategoryCard from "../components/CategoryCard";
import "./CategoryPage.css";

const CategoryPage = () => {
  // Mock array to render 8 cards
  const mockCategories = Array.from({ length: 8 });

  return (
    <div className="category-page-container">
      <NavBar />

      <main className="category-page-content">
        <section className="category-grid">
          {mockCategories.map((_, idx) => (
            <CategoryCard key={idx} />
          ))}
        </section>
      </main>
    </div>
  );
};

export default CategoryPage;

