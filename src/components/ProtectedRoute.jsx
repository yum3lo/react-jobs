import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireJobPoster = false }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return <div className="container mx-auto p-6 text-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (requireJobPoster && user.role !== 'job_poster') {
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;