import Card from "./Card";
import { Link } from "react-router-dom";

const HomeCards = ({ isLoggedIn }) => {
  return (
    <section className="py-8">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-lg">
          <Card>
            <h2 className="text-2xl font-bold text-[var(--red)]">
              For Developers
            </h2>
            <p className="mt-2 mb-4">
              Browse our React jobs and start your career today
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-[var(--opposite)] text-[var(--background)] rounded-lg px-4 py-2 hover:bg-[var(--red)]"
            >
              Browse Jobs
            </Link>
          </Card>
          <Card bg="bg-[var(--card)]">
            <h2 className="text-2xl font-bold text-[var(--background)]">
              For Employers
            </h2>
            <p className="mt-2 mb-4 text-[var(--hover)]">
              List your job to find the perfect developer for the role
            </p>
            <Link
              to={isLoggedIn ? "/add-job" : "/login"}
              className="inline-block bg-[var(--hover)] text-[var(--primary)] rounded-lg px-4 py-2 hover:bg-[var(--background)]"
            >
              Add Job
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeCards;
