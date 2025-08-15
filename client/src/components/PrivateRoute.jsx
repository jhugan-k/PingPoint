import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = () => {
  // Get the user from the global Redux state
  const { user } = useSelector((state) => state.auth);

  // If there is a user, render the child components (the protected page).
  // The <Outlet /> component is a placeholder for the child route element.
  // If there is no user, redirect to the /login page.
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;