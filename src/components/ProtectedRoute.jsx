import { Navigate } from 'react-router-dom';
import Preloader from './Preloader';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authState } = useAuth();
  
  if (authState.isLoading) {
    return <Preloader/>;
  }

  if (!authState.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;