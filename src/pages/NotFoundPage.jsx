import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <section className="text-center flex flex-col justify-center items-center">
      <FaExclamationTriangle className="text-yellow-400 text-6xl mb-4 mt-20"></FaExclamationTriangle>
      <h1 className="text-6xl font-bold mb-4">404 Not Found</h1>
      <p className="text-xl mb-5">This page does not exist</p>
      <Link
        to="/"
        className="bg-indigo-700 text-white hover:bg-indigo-900 rounded-md px-3 py-2 mt-4 width-1/2 mx-auto"
      >
        Go Back{" "}
      </Link>
    </section>
  );
};

export default NotFoundPage;
