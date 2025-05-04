import { Link } from "react-router-dom";
import { FaExclamationTriangle } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <section className="bg-[var(--hover)] text-center flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
      <FaExclamationTriangle className="text-[var(--red)] text-6xl mb-4"></FaExclamationTriangle>
      <h1 className="text-4xl md:text-6xl font-bold mb-4">404 Not Found</h1>
      <p className="text-lg md:text-xl mb-5">This page does not exist</p>
      <Link
        to="/"
        className="text-[var(--background)] bg-[var(--text)] hover:bg-[var(--card)] rounded-md px-3 py-2 mt-4 width-1/2 mx-auto"
      >
        Go Back{" "}
      </Link>
    </section>
  );
};

export default NotFoundPage;
