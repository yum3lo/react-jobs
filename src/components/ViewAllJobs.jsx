import { Link } from "react-router-dom";

const ViewAllJobs = () => {
  return (
    <section className="m-auto max-w-lg my-10 px-6">
      <Link
        to="/jobs"
        className="block bg-[var(--card)] text-[var(--background)] text-center py-4 px-6 rounded-xl hover:bg-[var(--red)]"
      >
        View All Jobs
      </Link>
    </section>
  );
};

export default ViewAllJobs;
