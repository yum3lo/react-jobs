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
import JobPage from "./pages/JobPage";
import AddJobPage from "./pages/AddJobPage";
import UpdateJobPage from "./pages/UpdateJobPage";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/theme.css';
import { AuthProvider } from './context/AuthContext';
import { JobProvider, jobLoader } from './context/JobContext';

const AppContent = () => {  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="jobs" element={<JobsPage />} />
        <Route 
          path="add-job" 
          element={
            <ProtectedRoute requireJobPoster={true}>
              <AddJobPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="jobs/:id" 
          element={<JobPage />} 
          loader={jobLoader}
        />
        <Route 
          path="jobs/:id/edit" 
          element={
            <ProtectedRoute requireJobPoster={true}>
              <UpdateJobPage />
            </ProtectedRoute>
          } 
          loader={jobLoader}
        />
        <Route path="register" element={<RegisterPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
          }
        />
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
      <JobProvider>
        <AppContent />
      </JobProvider>
    </AuthProvider>
  );
};

export default App;