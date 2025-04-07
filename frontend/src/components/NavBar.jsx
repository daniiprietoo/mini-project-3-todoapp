import { Link } from "react-router-dom";

function Navbar({ user, onLogout }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-black/90 backdrop-blur-md text-white py-4 px-6 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link to="/" className="font-bold text-lg">
            TodoApp<span className="text-blue-500">.</span>
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link to="/" className="text-gray-300 hover:text-white transition">
              Todos
            </Link>
            <Link
              to="/about"
              className="text-gray-300 hover:text-white transition"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="text-gray-300 hover:text-white transition"
            >
              Contact
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-black px-4 py-2 rounded-md hover:bg-gray-200 transition font-medium"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="font-medium">
                    {user.firstName
                      ? user.firstName.charAt(0).toUpperCase()
                      : user.username
                      ? user.username.charAt(0).toUpperCase()
                      : "U"}
                  </span>
                </div>
                <span className="hidden md:inline text-sm font-medium">
                  {user.firstName
                    ? `${user.firstName} ${user.lastName}`
                    : user.username}
                </span>
                {user.isAdmin && (
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
              <button
                onClick={onLogout}
                className="text-sm text-gray-300 hover:text-white transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
