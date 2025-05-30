import Card from "./Card";
import { Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';

const HomeCards = () => {
  const { isAuthenticated, user } = useAuth();
  const isJobPoster = isAuthenticated && user?.role === 'job_poster';
  
  return (
    <section className="py-8">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-lg">
          <Card>
            <h2 className="text-2xl font-bold text-[var(--red)]">
              For Job Seekers
            </h2>
            <p className="mt-2 mb-4">
              Browse our React jobs and start your career today
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-[var(--text)] text-[var(--background)] rounded-lg px-4 py-2 hover:bg-[var(--red)]"
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
              to={!isAuthenticated ? "/login" : 
                  isJobPoster ? "/add-job" : "/unauthorized"}
              className="inline-block bg-[var(--hover)] text-[var(--text)] rounded-lg px-4 py-2 hover:bg-[var(--background)]"
            >
              {!isAuthenticated ? "Sign In to Post" : 
               isJobPoster ? "Add Job" : "Job Poster Access Only"}
            </Link>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default HomeCards;
