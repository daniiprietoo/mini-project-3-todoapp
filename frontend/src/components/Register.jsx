// src/components/Register.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

  const navigate = useNavigate();
  const cities = ["New York", "Los Angeles", "Chicago", "Houston"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let valid = true;
    let errorMessage = "";

    // First name validation
    if (!formData.first_name.trim()) {
      errorMessage = "First name is required";
      valid = false;
    }
    // Last name validation
    else if (!formData.last_name.trim()) {
      errorMessage = "Last name is required";
      valid = false;
    }
    // Email validation
    else if (!formData.email.trim()) {
      errorMessage = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errorMessage = "Email is invalid";
      valid = false;
    }
    // City validation
    else if (!formData.city) {
      errorMessage = "City is required";
      valid = false;
    }
    // Zip code validation
    else if (!formData.zip_code.trim()) {
      errorMessage = "Zip code is required";
      valid = false;
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zip_code)) {
      errorMessage = "Zip code is invalid";
      valid = false;
    }
    // Username validation
    else if (!formData.username.trim()) {
      errorMessage = "Username is required";
      valid = false;
    } else if (formData.username.length < 3) {
      errorMessage = "Username must be at least 3 characters";
      valid = false;
    }
    // Password validation
    else if (!formData.password.trim()) {
      errorMessage = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      errorMessage = "Password must be at least 8 characters";
      valid = false;
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(formData.password)) {
      errorMessage =
        "Password must contain at least one digit, one lowercase, and one uppercase letter";
      valid = false;
    }

    if (!valid) {
      alert(errorMessage);
    }

    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with data:", formData);

    if (!validateForm()) {
      return;
    }

    try {
      // Call userServices.register with the form data directly
      const userId = await userServices.register(formData);

      // Show success alert
      alert("Registration successful! Redirecting to login...");

      // Reset form
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

      console.log("User registered with ID:", userId);

      // Redirect to login after 1 second
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      // Show error alert
      alert(error.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-8">
      <h1 className="text-2xl font-bold text-center mb-6">Register</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              placeholder="Enter your first name"
            />
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              placeholder="Enter your last name"
            />
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
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            placeholder="example@email.com"
          />
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            >
              <option value="">Select a city</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
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
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
              placeholder="Zip code"
            />
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
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            placeholder="Choose a username"
          />
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
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 border-gray-300"
            placeholder="Create a password"
          />
          <ul className="text-xs text-gray-600 mt-2 space-y-1">
            <li>At least 8 characters long</li>
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
          <Link to="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </form>
    </div>
  );
}

export default Register;
