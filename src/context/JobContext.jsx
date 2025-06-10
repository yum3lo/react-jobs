import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { API_BASE_URL } from "../config";
import { useAuth } from './AuthContext';

const JobContext = createContext();

const fetchJobById = async (id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch job: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    throw error;
  }
};

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { authenticatedRequest } = useAuth();

  const refreshJobData = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const fetchJobs = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      let queryString = '';
      if (params.limit) {
        queryString += `?_limit=${params.limit}`;
      }
      
      if (params.type) {
        queryString += queryString ? `&type=${params.type}` : `?type=${params.type}`;
      }
      
      if (params.salary) {
        queryString += queryString ? `&salary=${params.salary}` : `?salary=${params.salary}`;
      }
      
      const apiUrl = `${API_BASE_URL}/jobs${queryString}`;
      const res = await fetch(apiUrl);
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      const receivedJobs = Array.isArray(data) ? data : (data.jobs || []);
      
      setJobs(receivedJobs);
      return receivedJobs;
    } catch (error) {
      setError(error.message);
      setJobs([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, refreshTrigger]);

  const addJob = async (newJob) => {
    try {
      const res = await authenticatedRequest(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        body: JSON.stringify(newJob)
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to create job');
      }
      
      refreshJobData();
      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  const updateJob = async (updatedJob) => {
    try {
      const response = await authenticatedRequest(`${API_BASE_URL}/jobs/${updatedJob.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedJob),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to update job');
      }

      refreshJobData();
      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  const deleteJob = async (id) => {
    try {
      const res = await authenticatedRequest(`${API_BASE_URL}/jobs/${id}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to delete job (${res.status})`);
      }
      
      refreshJobData();
      return await res.json();
    } catch (error) {
      throw error;
    }
  };

  const getJob = async (id) => {
    return fetchJobById(id);
  };
  
  const fetchUserJobs = useCallback(async (userId) => {
    setLoading(true);
    try {
      // Make sure userId is a number if your DB expects it that way
      const res = await fetch(`${API_BASE_URL}/jobs?user_id=${userId}`);
      
      if (!res.ok) {
        throw new Error('Failed to fetch user jobs');
      }
      
      const data = await res.json();
      // Store the fetched jobs in the context state to avoid refetching
      const userJobs = data.jobs || [];
      return userJobs;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return (
    <JobContext.Provider value={{ 
      jobs,
      loading,
      error,
      refreshTrigger, 
      refreshJobData,
      fetchJobs,
      addJob,
      updateJob,
      deleteJob,
      getJob,
      fetchUserJobs
    }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => useContext(JobContext);

export const jobLoader = async ({params}) => {
  return await fetchJobById(params.id);
};