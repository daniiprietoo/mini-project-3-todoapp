// src/components/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userServices } from "../model/userServices";

function Register() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    zip_code: "",
    username: "",
    password: "",
    is_admin: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const cities = ["New York", "Los Angeles", "Chicago", "Houston"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // First Name validation
    if (!formData.first_name) {
      newErrors.first_name = "First name is required";
    } else if (/\d/.test(formData.first_name)) {
      newErrors.first_name = "First name should not contain numbers";
    }

    // Last Name validation
    if (!formData.last_name) {
      newErrors.last_name = "Last name is required";
    } else if (/\d/.test(formData.last_name)) {
      newErrors.last_name = "Last name should not contain numbers";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (
      !formData.email.includes("@") ||
      !formData.email.includes(".") ||
      formData.email.indexOf("@") > formData.email.lastIndexOf(".")
    ) {
      newErrors.email = "Invalid email format";
    }

    // City validation
    if (!formData.city) {
      newErrors.city = "Please select a city";
    }

    // Zip Code validation
    if (!formData.zip_code) {
      newErrors.zip_code = "Zip code is required";
    } else if (!/^\d+$/.test(formData.zip_code)) {
      newErrors.zip_code = "Zip code must be numeric only";
    }

    // Username validation
    if (!formData.username) {
      newErrors.username = "Username is required";
    } else if (formData.username.includes(" ")) {
      newErrors.username = "Username must not contain spaces";
    } else if (/^[\d\W]/.test(formData.username)) {
      newErrors.username =
        "Username must not start with a number or special character";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 10) {
        newErrors.password = "Password must be at least 10 characters long";
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password =
          newErrors.password ||
          "Password must contain at least one uppercase letter";
      }
      if (!/[a-z]/.test(formData.password)) {
        newErrors.password =
          newErrors.password ||
          "Password must contain at least one lowercase letter";
      }
      if (!/\d/.test(formData.password)) {
        newErrors.password =
          newErrors.password || "Password must contain at least one digit";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Form data before submission:", formData);

    if (!validateForm()) {
      console.log("Form validation failed:", errors);
      return;
    }

    console.log("Form data after validation:", formData);

    try {
      const userId = await userServices.register(formData);

      console.log("Registration successful for user:", userId);

      // Registration successful
      setSuccessMessage("Registration successful! Redirecting to login...");

      // Clear form and errors
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        city: "",
        zip_code: "",
        username: "",
        password: "",
        is_admin: false,
      });
      setErrors({});

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Error during registration:", error);
      setErrors((prev) => ({
        ...prev,
        server: "An error occurred. Please try again.",
      }));
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

      {successMessage ? (
        <div className="p-4 bg-green-100 text-green-700 rounded-md mb-4">
          {successMessage}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.server && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4">
              {errors.server}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="first_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.first_name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your first name"
              />
              {errors.first_name && (
                <p className="text-red-500 text-xs mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="last_name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.last_name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your last name"
              />
              {errors.last_name && (
                <p className="text-red-500 text-xs mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="example@email.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                City
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.city ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="zip_code"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zip Code
              </label>
              <input
                type="text"
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                  errors.zip_code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Zip code"
              />
              {errors.zip_code && (
                <p className="text-red-500 text-xs mt-1">{errors.zip_code}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.username ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <ul className="text-xs text-gray-600 mt-2 space-y-1">
              <li>At least 10 characters long</li>
              <li>At least one uppercase letter</li>
              <li>At least one lowercase letter</li>
              <li>At least one digit</li>
            </ul>
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login here
            </a>
          </div>
        </form>
      )}
    </div>
  );
}

export default Register;
