import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';

// Import Page & Layout Components
import App from './App.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';

// Import global styles
import './index.css';

// This is the router configuration for the entire application.
const router = createBrowserRouter([
  {
    path: '/',
    element: <PrivateRoute />, // The PrivateRoute component acts as a guard.
    // These are the "child" routes that will be rendered inside the PrivateRoute's <Outlet />
    // if the user is authenticated.
    children: [
      {
        path: '/',
        element: <App />, // This is our main dashboard component.
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
]);

// This renders the application.
// The Redux <Provider> makes the global state available to all components.
// The <RouterProvider> handles which component to display based on the URL.
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);