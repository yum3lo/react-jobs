import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const UnauthorizedPage = () => {
  return (
    <section className="bg-[var(--hover)] text-center flex flex-col justify-center items-center h-[calc(100vh-4rem)]">
      <FaExclamationTriangle className="text-[var(--red)] text-6xl mb-4" />
      <h1 className="text-4xl md:text-6xl font-bold mb-4">Access Denied</h1>
      <p className="text-lg md:text-xl mb-5">
        You don't have permission to access this page.
      </p>
      <p className="text-lg mb-5">
        This feature is only available to job posters.
      </p>
      <div className="flex flex-col md:flex-row gap-4 mt-2">
        <Link 
          to="/" 
          className="text-[var(--background)] bg-[var(--text)] hover:bg-[var(--card)] rounded-md px-3 py-2"
        >
          Go Home
        </Link>
        <Link
          to="/register"
          className="text-[var(--text)] border border-[var(--text)] hover:bg-[var(--background)] rounded-md px-3 py-2"
        >
          Register as Job Poster
        </Link>
      </div>
    </section>
  );
};

export default UnauthorizedPage;