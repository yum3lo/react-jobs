import Card from "./Card";
import { Link } from "react-router-dom";

const HomeCards = ({ isLoggedIn }) => {
  return (
    <section className="py-8">
      <div className="container-xl lg:container m-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-lg">
          <Card>
            <h2 className="text-2xl font-bold text-orange-700">
              For Developers
            </h2>
            <p className="mt-2 mb-4">
              Browse our React jobs and start your career today
            </p>
            <Link
              to="/jobs"
              className="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-orange-700"
            >
              Browse Jobs
            </Link>
          </Card>
          <Card>
            <h2 className="text-2xl font-bold text-indigo-700">
              For Employers
            </h2>
            <p className="mt-2 mb-4">
              List your job to find the perfect developer for the role
            </p>
            <Link
              to={isLoggedIn ? "/add-job" : "/login"}
              className="inline-block bg-indigo-700 text-white rounded-lg px-4 py-2 hover:bg-indigo-900"
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
