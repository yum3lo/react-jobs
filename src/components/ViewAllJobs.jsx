import { Link } from "react-router-dom";

const ViewAllJobs = () => {
  return (
    <section className="w-full px-8 pb-8 flex flex-col items-center bg-[var(--hover)]">
      <Link
        to="/jobs"
        className="w-full md:w-1/2 bg-[var(--card)] text-[var(--background)] text-center py-4 px-6 rounded-xl hover:bg-[var(--red)]"
      >
        View All Jobs
      </Link>
    </section>
  );
};

export default ViewAllJobs;
