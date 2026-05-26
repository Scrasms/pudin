import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router';
import { UserContext } from '../contexts/UserContext';

/**
 * Wrapper component that displays its children if the user is logged in
 * or reroutes to landing page otherwise
 */
const AuthOnly = () => {
  const { user, loading } = useContext(UserContext);

  // Don't redirect while user info is still loading
  if (loading || !user) return null;
  if (user.uid === '') return <Navigate to="/" replace />;
  return <Outlet />;
};

export default AuthOnly;
