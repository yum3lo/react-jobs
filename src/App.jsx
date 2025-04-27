import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

import { useState } from "react";

import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import MainLayout from "./layouts/MainLayout";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage, {jobLoader} from "./pages/JobPage";
import AddJobPage from "./pages/AddJobPage";
import UpdateJobPage from "./pages/UpdateJobPage";
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import './styles/theme.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const addJob = async (newJob) => {
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newJob)
    })
    return res.json();
  }

  const deleteJob = async (id) => {
    const res = await fetch(`/api/jobs/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to delete job');
    }
    
    return res.json();
  };

  const updateJob = async (job) => {
    const res = await fetch(`/api/jobs/${job.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(job)
    })

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Failed to update job');
    }

    return res.json();
  }
  
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>}>
        <Route index element={<HomePage isLoggedIn={isLoggedIn}/>} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route path="/add-job" element={<AddJobPage addJobSubmit={addJob} isLoggedIn={isLoggedIn}/>} />
        <Route path="/jobs/:id" element={<JobPage isLoggedIn={isLoggedIn} deleteJob={deleteJob} />}  loader={jobLoader}/>
        <Route path="/jobs/:id/edit" element={<UpdateJobPage updateJobSubmit={updateJob} isLoggedIn={isLoggedIn} />} loader={jobLoader}/>
        <Route path="*" element={<NotFoundPage />} />
        <Route path="/register" element={<RegisterPage setIsLoggedIn={setIsLoggedIn}/>} />
        <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn}/>} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

export default App;
