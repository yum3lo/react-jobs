import { useState } from "react";
import JobListings from "../components/JobListings";
import JobFilters from "../components/JobFilters";

const JobsPage = () => {
  const [filters, setFilters] = useState({});

  return (
    <>
      <JobFilters onFilter={setFilters} />
      <JobListings filters={filters} />
    </>
  );
};

export default JobsPage;