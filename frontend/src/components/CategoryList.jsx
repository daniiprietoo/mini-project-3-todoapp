// src/components/CategoryList.jsx
import React from 'react';

function CategoryList({ categories, selectedCategory, onCategoryChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {/* "All Categories" button */}
      <button
        onClick={() => onCategoryChange("")}
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          !selectedCategory
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        All Categories
      </button>
      
      {/* Category buttons */}
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(category.id)}
          className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            selectedCategory === category.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryList;