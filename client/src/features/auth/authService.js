// The base URL for our authentication API endpoints
const API_URL = import.meta.env.VITE_API_URL + '/api/users/';

// --- Register User Function ---
// This function sends a POST request to the '/register' endpoint.
const register = async (userData) => {
  const response = await fetch(API_URL + 'register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  // If the server responds with an error status (e.g., 400),
  // we parse the error message from the response body and throw it.
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  const data = await response.json();

  // On successful registration, save the new user's data (including the token)
  // to the browser's localStorage to persist the session.
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

// --- Login User Function ---
// This function is now separate and correctly defined.
const login = async (userData) => {
  const response = await fetch(API_URL + 'login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();

  // On successful login, also save the user's data to localStorage.
  if (data) {
    localStorage.setItem('user', JSON.stringify(data));
  }

  return data;
};

// --- Export the functions ---
// Now both 'register' and 'login' are correctly defined in this scope.
const authService = {
  register,
  login,
};

export default authService;