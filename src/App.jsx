import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage, {jobLoader} from "./pages/JobPage";
import AddJobPage from "./pages/AddJobPage";
import UpdateJobPage from "./pages/UpdateJobPage";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/theme.css';
import { API_BASE_URL } from './config';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const AppContent = () => {
  const { authenticatedRequest } = useAuth();

  const addJob = async (newJob) => {
    const res = await authenticatedRequest(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      body: JSON.stringify(newJob)
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to create job');
    }
    
    return res.json();
  };

  const deleteJob = async (id) => {
    const res = await authenticatedRequest(`${API_BASE_URL}/jobs/${id}`, {
      method: 'DELETE'
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to delete job');
    }
    
    return res.json();
  };

  const updateJob = async (job) => {
    const res = await authenticatedRequest(`${API_BASE_URL}/jobs/${job.id}`, {
      method: 'PUT',
      body: JSON.stringify(job)
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update job');
    }

    return res.json();
  };
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route 
          path="add-job" 
          element={
            <ProtectedRoute requireJobPoster={true}>
              <AddJobPage addJobSubmit={addJob} />
            </ProtectedRoute>
          } 
        />
        <Route path="jobs/:id" element={<JobPage deleteJob={deleteJob} />} loader={jobLoader}/>
        <Route 
          path="jobs/:id/edit" 
          element={
            <ProtectedRoute requireJobPoster={true}>
              <UpdateJobPage updateJobSubmit={updateJob} />
            </ProtectedRoute>
          } 
          loader={jobLoader}
        />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
