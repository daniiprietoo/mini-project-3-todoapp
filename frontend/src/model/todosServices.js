import axios from 'axios';

const HOST = 'http://localhost:3000'; // Match the port in your backend index.js

const api = axios.create({
  baseURL: HOST,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const todosServices = {
  // fetch all todos
  fetchTodos: async () => {
    try {
      const response = await api.get('/todos');
      return response.data;
    } catch (error) {
      console.error("Error fetching todos:", error);
      throw error;
    }
  },

  // Create a new todo
  createTodo: async (todoData) => {
    try {
      // Ensure category_id is null if it's an empty string
      const preparedData = {
        ...todoData,
        category_id: todoData.category_id === '' ? null : todoData.category_id
      };
      
      const response = await api.post('/todos', preparedData);
      return response.data;
    } catch (error) {
      console.error("Error creating todo:", error);
      throw error;
    }
  },

  // Update a todo
  updateTodo: async (todoId, todoData) => {
    try {
      // Ensure category_id is null if it's an empty string
      const preparedData = {
        ...todoData,
        category_id: todoData.category_id === '' ? null : todoData.category_id
      };
      
      const response = await api.put(`/todos/${todoId}`, preparedData);
      return response.data;
    } catch (error) {
      console.error("Error updating todo:", error);
      throw error;
    }
  },
  
  deleteTodo: async (todoId) => {
    try {
      const response = await api.delete(`/todos/${todoId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting todo:", error);
      throw error;
    }
  },
  
};

export default api;