import React from "react";
import "./CategoryCard.css";

const CategoryCard = ({ category }) => {
  return (
    <div className="category-card">
      <h3 className="category-card-title">{category ? category.name : "Placeholder"}</h3>
    </div>
  );
};

export default CategoryCard;


