import { useState } from "react";

const JobFilters = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    location: "",
    type: "",
    salary: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    setFilters({
      location: "",
      type: "",
      salary: ""
    });
    onFilter({});
  };

  return (
    <div className="bg-[var(--card)] p-6">
      <h3 className="text-xl text-[var(--background)] font-bold mb-4">Filter Jobs</h3>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-[var(--hover)] mb-1">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              className="bg-[var(--hover)] rounded w-full py-2 px-3"
              placeholder="City or State"
              value={filters.location}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-[var(--hover)] mb-1">
              Job Type
            </label>
            <select
              id="type"
              name="type"
              className="bg-[var(--hover)] rounded w-full py-2 px-3"
              value={filters.type}
              onChange={handleChange}
            >
              <option value="">All Types</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Remote">Remote</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-[var(--hover)] mb-1">
              Salary Range
            </label>
            <select
              id="salary"
              name="salary"
              className="bg-[var(--hover)] rounded w-full py-2 px-3"
              value={filters.salary}
              onChange={handleChange}
            >
              <option value="">All Salaries</option>
              <option value="Under $50K">Under $50K</option>
              <option value="$50K - $60K">$50K - $60K</option>
              <option value="$60K - $70K">$60K - $70K</option>
              <option value="$70K - $80K">$70K - $80K</option>
              <option value="$80K - $90K">$80K - $90K</option>
              <option value="$90K - $100K">$90K - $100K</option>
              <option value="$100K - $125K">$100K - $125K</option>
              <option value="$125K - $150K">$125K - $150K</option>
              <option value="$150K - $175K">$150K - $175K</option>
              <option value="$175K - $200K">$175K - $200K</option>
              <option value="Over $200K">Over $200K</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={handleReset}
            className="text-[var(--background)] px-4 py-2 border border-[var(--background)] rounded-md hover:bg-[var(--opposite)]"
          >
            Reset
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--text)] text-[var(--background)] rounded-md hover:bg-[var(--opposite)]"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobFilters;