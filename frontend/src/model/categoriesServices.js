import axios from 'axios';

const HOST = 'http://localhost:3000'; // Match the port in your backend index.js

const api = axios.create({
  baseURL: HOST,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const categoriesServices = {
  fetchCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },
  createCategory: async (categoryData) => {
    try {
      const response = await api.post('/categories', categoryData);
      return response.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  }
};

export default api;