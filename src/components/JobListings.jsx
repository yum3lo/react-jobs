import { useState, useEffect, useMemo } from "react";
import Spinner from "./Spinner";
import JobListing from "./JobListing";
import { useJobContext } from '../context/JobContext';

const JobListings = ({ isHome = false, filters = {} }) => {
  const { jobs, loading, error, fetchJobs } = useJobContext();
  
  useEffect(() => {
    if (isHome) {
      fetchJobs({ limit: 3 });
    } else {
      fetchJobs();
    }
  }, [isHome, fetchJobs]);
  
  const filteredJobs = useMemo(() => {
    if (!jobs.length) return [];
    let result = [...jobs];

    if (filters.location) {
      result = result.filter(job => 
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      result = result.filter(job => job.type === filters.type);
    }

    if (filters.salary) {
      result = result.filter(job => job.salary === filters.salary);
    }

    return result;
  }, [jobs, filters]);

  return (
    <section className="bg-[var(--hover)] w-full p-8">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center">
          {isHome ? "Recent Jobs" : "Browse Jobs"}
        </h2>
        
        {loading ? (
          <Spinner loading={loading} />
        ) : error ? (
          <p className="text-center text-[var(--red)] py-10">
            Error loading jobs: {error}
          </p>
        ) : (
          <>
            {filteredJobs.length === 0 ? (
              <p className="text-center text-[var(--background)] py-10">
                {jobs.length === 0 
                  ? "No jobs available" 
                  : "No jobs match your filters"}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.map(job => (
                  <JobListing key={job.id} job={job} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default JobListings;