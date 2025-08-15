import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';

const RegisterPage = () => {
  // State for the form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Hooks for navigation and dispatching Redux actions
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get the relevant state from the global Redux auth slice
  const { user, isLoading, isSuccess, isError, message } = useSelector(
    (state) => state.auth
  );

  // This useEffect hook runs whenever the auth state changes.
  // It handles the side-effects of the registration attempt (e.g., redirecting or showing errors).
  useEffect(() => {
    if (isError) {
      // Show an alert with the error message from the backend (e.g., "User already exists")
      alert(message);
    }

    // If registration was successful or if the user is already logged in, redirect to the dashboard.
    if (isSuccess || user) {
      navigate('/');
    }

    // Reset the auth state (isLoading, isSuccess, etc.) after we've handled the outcome.
    // This is crucial to prevent the effect from running in a loop or on subsequent renders.
    dispatch(reset());
  }, [user, isSuccess, isError, message, navigate, dispatch]);

  // This function is called when the user submits the form.
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default browser reload

    // Package the form data into an object
    const userData = { name, email, password };

    // Dispatch the 'register' async thunk with the user data
    dispatch(register(userData));
  };

  // If the registration is in progress, we can show a simple loading text.
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-cyan-400 mb-6">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 mb-2">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-700 text-white p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 mb-2">Email</label>
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
            Register
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;