// src/components/CategoryList.js
import React from 'react';

function CategoryList({ categories }) {
  return (
    <select className="text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
      <option value="">All Categories</option>
      {categories.map(category => (
        <option key={category.id} value={category.id}>{category.name}</option>
      ))}
    </select>
  );
}

export default CategoryList;