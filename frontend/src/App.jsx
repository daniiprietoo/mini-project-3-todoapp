import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/NavBar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import { userServices } from "./model/userServices";

function App() {
  // State to manage user authentication status
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for logged-in user on app load
  useEffect(() => {
    const checkLoggedInUser = () => {
      const loggedInUser = userServices.getCurrentUser();
      if (loggedInUser) {
        setUser(loggedInUser);
      }
      setLoading(false);
    };

    checkLoggedInUser();
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    userServices.logout();
    setUser(null);
  };

  // If the app is still loading, show a loading spinner
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={handleLogout} />
      <main className="pt-16 min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/home" element={<Home user={user} />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" replace /> : <Register />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
