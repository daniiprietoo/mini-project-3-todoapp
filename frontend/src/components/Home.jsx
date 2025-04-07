import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import TodoList from "./TodoList";
import TodoDetails from "./TodoDetails";
import TodoForm from "./TodoForm";
import CategoryList from "./CategoryList";
import { todosServices } from "../model/todosServices";
import { categoriesServices } from "../model/categoriesServices";

function Home({ user }) {
  // State management
  const [todos, setTodos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [hoveredTodo, setHoveredTodo] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Fetch todos and categories when user changes
  useEffect(() => {
    if (user) {
      fetchTodos();
      fetchCategories();
    } else {
      setTodos([]);
      setCategories([]);
      setSelectedTodo(null);
      setHoveredTodo(null);
    }
  }, [user]);

  // Fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todosServices.fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
      setError("Failed to load your tasks. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const data = await categoriesServices.fetchCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    }
  };

  // Handle adding a todo
  const handleAddTodo = async (todo) => {
    try {
      setLoading(true);
      await todosServices.createTodo(todo);
      await fetchTodos();
      setShowAddForm(false);
    } catch (error) {
      console.error("Error adding todo:", error);
      setError("Failed to add task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle updating a todo
  const handleUpdateTodo = async (updatedTodo) => {
    try {
      setLoading(true);
      await todosServices.updateTodo(updatedTodo.id, updatedTodo);
      await fetchTodos();
      setShowEditForm(false);
      setSelectedTodo(null);
    } catch (error) {
      console.error("Error updating todo:", error);
      setError("Failed to update task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isUserAdmin = () => {
    return user && user.is_admin === true;
  };

  // Handle deleting a todo
  const handleDeleteTodo = async (id) => {
    try {
      setLoading(true);
      await todosServices.deleteTodo(id);
      await fetchTodos();
      if (selectedTodo && selectedTodo.id === id) {
        setSelectedTodo(null);
      }
      if (hoveredTodo && hoveredTodo.id === id) {
        setHoveredTodo(null);
      }
    } catch (error) {
      console.error("Error deleting todo:", error);
      setError("Failed to delete task. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTodoClick = (todo) => {
    // If the clicked todo is already selected, unselect it
    if (selectedTodo && selectedTodo.id === todo.id) {
      setSelectedTodo(null);
    } else {
      setSelectedTodo(todo);
    }
  };

  // Handle adding a category
  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      return;
    }

    try {
      setLoading(true);
      await categoriesServices.createCategory({
        name: newCategoryName.trim(),
        user_id: user.id,
      });
      await fetchCategories();
      setShowAddCategory(false);
      setNewCategoryName("");
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Failed to add category. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle category filter change
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  // Filter todos by selected category
  const filteredTodos = selectedCategory
    ? todos.filter((todo) => todo.category_id === parseInt(selectedCategory))
    : todos;

  // If user isn't logged in, show login message
  if (!user) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to TodoApp
          </h1>
          <p className="text-gray-600 max-w-lg mx-auto">
            Sign in to start managing your tasks and boost your productivity.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
          <p className="text-gray-600 mb-6">
            Please log in to view and manage your tasks.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="bg-black text-white px-6 py-2 rounded-md transition hover:bg-gray-800"
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="border border-gray-300 text-gray-700 px-6 py-2 rounded-md transition hover:bg-gray-50"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with action buttons */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
          {isUserAdmin() && (
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddCategory(true)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                disabled={loading}
              >
                Add Category
              </button>
              <button
                onClick={() => {
                  // Only open edit form if a task is selected
                  if (selectedTodo) {
                    setShowEditForm(true);
                    setShowAddForm(false);
                  } else {
                    // Alert the user that no task is selected
                    alert("Please select a task to edit");
                  }
                }}
                className={`px-4 py-2 ${
                  selectedTodo
                    ? "bg-black text-white hover:bg-gray-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                } rounded-md transition-colors`}
                disabled={loading || !selectedTodo}
              >
                Edit Task
              </button>
              <button
                onClick={() => {
                  setShowAddForm(true);
                  setShowEditForm(false);
                  setSelectedTodo(null);
                }}
                className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                disabled={loading}
              >
                Create Task
              </button>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Add Category Form */}
      {showAddCategory && (
        <div className="mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
          <div className="flex items-center">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Category name"
            />
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 transition-colors"
              disabled={loading || !newCategoryName.trim()}
            >
              {loading ? "Adding..." : "Add"}
            </button>
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setShowAddCategory(false);
                setNewCategoryName("");
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Todo Form */}
      {(showAddForm || showEditForm) && (
        <div className="mb-6">
          <TodoForm
            todo={showEditForm ? selectedTodo : null}
            categories={categories}
            onSubmit={showEditForm ? handleUpdateTodo : handleAddTodo}
            onCancel={() => {
              setShowAddForm(false);
              setShowEditForm(false);
            }}
          />
        </div>
      )}

      {/* Filter by category */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        <div className="text-sm text-gray-500">
          {filteredTodos.length} {filteredTodos.length === 1 ? "task" : "tasks"}{" "}
          found
        </div>
      </div>

      {/* Two-column layout for tasks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Task list */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Task List</h2>

          {/* TodoList component */}
          {loading && filteredTodos.length === 0 ? (
            <div className="py-8 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
            </div>
          ) : filteredTodos.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p>No tasks yet. Create your first task!</p>
            </div>
          ) : (
            <TodoList
              todos={filteredTodos}
              selectedTodoId={selectedTodo?.id}
              onTodoClick={handleTodoClick}
              onTodoHover={setHoveredTodo}
              onTodoEdit={(todo) => {
                setSelectedTodo(todo);
                setShowEditForm(true);
                setShowAddForm(false);
              }}
              onTodoDelete={handleDeleteTodo}
              isAdmin={user.is_admin}
            />
          )}
        </div>

        {/* Right column - Task details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Task Details</h2>

          {/* Todo details */}
          {selectedTodo || hoveredTodo ? (
            <TodoDetails
              todo={selectedTodo || hoveredTodo}
              onEdit={(todo) => {
                setSelectedTodo(todo);
                setShowEditForm(true);
                setShowAddForm(false);
              }}
              onDelete={handleDeleteTodo}
              isAdmin={user.isAdmin}
            />
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-gray-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mb-4 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p>Select a task to view details</p>
              <p className="text-sm mt-2">
                Or hover over a task for a quick preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
