// src/components/TodoDetails.js
import React from "react";

function TodoDetails({ todo, onDelete, onEdit, isAdmin }) {
  const getPriorityBadge = (priority) => {
    const colors = {
      high: "bg-red-100 text-red-800",
      medium: "bg-orange-100 text-orange-800",
      low: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          colors[priority] || "bg-gray-100 text-gray-800"
        }`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-800",
      in_progress: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
    };

    const label = status
      .replace("_", " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          colors[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {label}
      </span>
    );
  };

  const handleEditClick = (e) => {
    e,stopPropagation();
    if (onEdit) onEdit(todo);
  }

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(todo.id);

  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 relative">
      {/* Admin action buttons in top right corner */}
      {isAdmin && (
        <div className="absolute top-4 right-4 flex space-x-2">
          <button
            onClick={handleEditClick}
            className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
            aria-label="Edit"
            title="Edit task"
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
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            aria-label="Delete"
            title="Delete task"
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
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="mb-4 pr-20"> {/* Added right padding to make room for buttons */}
        <h3 className="text-xl font-semibold text-gray-800">{todo.title}</h3>
        {todo.category_name && (
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {todo.category_name}
          </span>
        )}
      </div>

      {todo.description && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-1">
            Description
          </h4>
          <p className="text-gray-600 whitespace-pre-line">
            {todo.description}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Due Date</h4>
          <p className="text-gray-600">
            {todo.due_date
              ? new Date(todo.due_date).toLocaleDateString()
              : "No due date"}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Created At</h4>
          <p className="text-gray-600">
            {todo.created_at
              ? new Date(todo.created_at).toLocaleDateString()
              : "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Priority</h4>
          {getPriorityBadge(todo.priority)}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Status</h4>
          {getStatusBadge(todo.status)}
        </div>
      </div>
    </div>
  );
}

export default TodoDetails;
