import React, { useState } from "react";

function TodoList({
  todos,
  selectedTodoId,
  onTodoClick,
  onTodoHover,
  onTodoEdit,
  onTodoDelete,
  isAdmin,
}) {
  const [filter, setFilter] = useState("all");

  // Get status color for styling
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Get priority color for styling
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "medium":
        return "text-orange-500";
      case "low":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Format the status text for display
  const formatStatus = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Filter todos based on selected filter
  const filteredTodos = todos.filter((todo) => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.status === "completed";
    if (filter === "active") return todo.status !== "completed";
    return true;
  });

  // Event handlers
  const handleEditClick = (e, todo) => {
    e.stopPropagation();
    if (onTodoEdit) onTodoEdit(todo);
  };

  const handleDeleteClick = (e, todoId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this task?")) {
      if (onTodoDelete) onTodoDelete(todoId);
    }
  };

  const handleTodoClick = (todo) => {
    if (onTodoClick) onTodoClick(todo);
  };

  const handleMouseEnter = (todo) => {
    if (onTodoHover) onTodoHover(todo);
  };

  const handleMouseLeave = () => {
    if (onTodoHover) onTodoHover(null);
  };

  console.log('admin', isAdmin);

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex mb-4 space-x-2">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 text-sm rounded-md ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 text-sm rounded-md ${
            filter === "active"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Active
        </button>
        <button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 text-sm rounded-md ${
            filter === "completed"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Completed
        </button>
      </div>

      {/* Todo items list */}
      {filteredTodos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No tasks found for this filter
        </div>
      ) : (
        <div className="space-y-2">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                todo.id === selectedTodoId
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
              onClick={() => handleTodoClick(todo)}
              onMouseEnter={() => handleMouseEnter(todo)}
              onMouseLeave={handleMouseLeave}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-2">
                  <div
                    className={`h-3 w-3 mt-1.5 rounded-full ${getPriorityColor(
                      todo.priority
                    )} bg-current flex-shrink-0`}
                  />
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-1">
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {todo.description}
                      </p>
                    )}
                    {todo.due_date && (
                      <p className="text-xs text-gray-500 mt-1">
                        Due: {new Date(todo.due_date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      todo.status
                    )}`}
                  >
                    {formatStatus(todo.status)}
                  </span>

                  {/* Only show edit/delete buttons if isAdmin is true */}
                  {isAdmin && (
                    <div className="flex space-x-1">
                      <button
                        onClick={(e) => handleEditClick(e, todo)}
                        className="text-blue-500 hover:text-blue-700"
                        aria-label="Edit task"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, todo.id)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Delete task"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TodoList;
