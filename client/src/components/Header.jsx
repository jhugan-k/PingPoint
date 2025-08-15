import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout, reset } from '../features/auth/authSlice';

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the user from the global Redux state to determine what to display.
  const { user } = useSelector((state) => state.auth);

  // This function is called when the user clicks the "Logout" button.
  const onLogout = () => {
    dispatch(logout());  // Dispatch the logout action to clear localStorage and the user state.
    dispatch(reset());   // Dispatch the reset action to clear status flags (isLoading, etc.).
    navigate('/login');  // Redirect the user to the login page.
  };

  return (
    <header className="bg-slate-800 p-4 shadow-md flex justify-between items-center">
      <h1 className="text-3xl font-bold text-cyan-400">
        <Link to="/">PingPoint</Link>
      </h1>
      <nav>
        {user ? (
          // If a user is logged in, display a welcome message and the Logout button.
          <div className="flex items-center gap-4">
            <span className="text-white hidden sm:block">Welcome, {user.name}!</span>
            <button
              onClick={onLogout}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          // If no user is logged in, display the Login and Register links.
          <ul className="flex items-center gap-4">
            <li>
              <Link to="/login" className="hover:text-cyan-400 transition-colors">Login</Link>
            </li>
            <li>
              <Link to="/register" className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md transition-colors">
                Register
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Header;