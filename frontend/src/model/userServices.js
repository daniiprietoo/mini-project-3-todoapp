import axios from 'axios';

const HOST = import.meta.env.HOST

const api = axios.create({
  baseURL: HOST,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const userServices = {
  // Login a user
  login: async (username, password) => {
    try {
      console.log('Attempting login with:', { username });
      
      const response = await api.post('/users/login', { username, password });
      console.log('Login response:', response.data);
      
      // Store the user data in sessionStorage
      if (response.data && response.data.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
        console.log('User data stored in sessionStorage:', response.data.user);
      }
      
      return response.data;
    } catch (error) {
      console.error("Login error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  },

  // Logout a user
  logout: () => {
    sessionStorage.removeItem('user');
    return { success: true };
  },

  // Get current user from session storage
  getCurrentUser: () => {
    const userStr = sessionStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Error parsing user data:", error);
      sessionStorage.removeItem('user');
      return null;
    }
  },

  // Register a new user
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      return response.userId;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },
};
  
export default api;