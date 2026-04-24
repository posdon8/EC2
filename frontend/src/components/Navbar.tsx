import { Link } from "react-router-dom";
import { useStore } from "../store/useStore";

export const Navbar = () => {
  const { isLoggedIn, user, logout, cartOpen, setCartOpen, cart } = useStore();

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          👕 E-Clothes
        </Link>

        <div className="flex gap-6 items-center">
          <Link to="/home" className="hover:text-blue-200">
            Home
          </Link>
          <Link to="/explore" className="hover:text-blue-200">
            Explore
          </Link>

          {isLoggedIn && (
            <>
              <Link to="/orders" className="hover:text-blue-200">
                Orders
              </Link>
              {user?.role === "admin" && (
                <Link to="/admin" className="bg-purple-600 px-3 py-1 rounded hover:bg-purple-700 font-medium">
                  Admin
                </Link>
              )}
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative hover:text-blue-200"
              >
                🛒 Cart
                {cart && cart.items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.items.length}
                  </span>
                )}
              </button>
              <span className="text-sm">{user?.name}</span>
              <button
                onClick={logout}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Link to="/login" className="hover:text-blue-200">
                Login
              </Link>
              <Link to="/register" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
