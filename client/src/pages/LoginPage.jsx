import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';

const LoginPage = () => {
  // State for the form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hooks for navigation and dispatching Redux actions
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the relevant state from the global Redux auth slice
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  // This useEffect hook handles the side-effects of the login attempt
  useEffect(() => {
    if (isError) {
      alert(message); // Show error message from backend (e.g., "Invalid email or password")
    }

    // If login is successful or user is already logged in, redirect to dashboard
    if (isSuccess || user) {
      navigate('/');
    }

    // Reset the auth state flags after handling the outcome
    dispatch(reset());
  }, [user, isSuccess, isError, message, navigate, dispatch]);

  // This function is called when the user submits the form
  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData)); // Dispatch the 'login' async thunk
  };

  // Show a simple loading indicator while the API call is in progress
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Authenticating...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          Login to PingPoint
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 rounded-md transition-colors"
          >
            Login
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;