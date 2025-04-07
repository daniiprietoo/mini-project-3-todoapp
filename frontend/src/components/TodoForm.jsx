import { useState, useEffect } from "react";

function TodoForm({ todo, categories, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
    status: "pending",
    category_id: "",
  });

  useEffect(() => {
    if (todo) {
      setFormData({
        ...todo,
        due_date: todo.due_date
          ? new Date(todo.due_date).toISOString().split("T")[0]
          : "",
        category_id: todo.category_id || "",
      });
    }
  }, [todo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a title for the task");
      return;
    }
    // If category_id is empty string, it will be handled as NULL in the backend
    const todoData = {
      ...formData,
      category_id: formData.category_id ? parseInt(formData.category_id) : null
    };

    onSubmit(todoData);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-50 border-red-300 text-red-800";
      case "medium":
        return "bg-yellow-50 border-yellow-300 text-yellow-800";
      case "low":
        return "bg-green-50 border-green-300 text-green-800";
      default:
        return "bg-gray-50 border-gray-300 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        {todo ? "Edit Task" : "Create New Task"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            placeholder="Task title"
          />
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description || ""}
            onChange={handleChange}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add details about this task"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="due_date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Due Date
            </label>
            <input
              type="date"
              id="due_date"
              name="due_date"
              value={formData.due_date || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label
              htmlFor="category_id"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">-- No Category --</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <div className="relative">
              <select
                id="priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <div
                  className={`w-3 h-3 rounded-full ${
                    formData.priority === "high"
                      ? "bg-red-500"
                      : formData.priority === "medium"
                      ? "bg-yellow-500"
                      : "bg-green-500"
                  }`}
                ></div>
              </div>
            </div>
            <div className="mt-1">
              <span
                className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(
                  formData.priority
                )}`}
              >
                {formData.priority.charAt(0).toUpperCase() +
                  formData.priority.slice(1)}
              </span>
            </div>
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 transition-colors"
          >
            {todo ? "Update Task" : "Create Task"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TodoForm;
