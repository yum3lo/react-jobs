import { NavLink } from "react-router-dom";
import { FaReact, FaRightFromBracket, FaBars, FaXmark, FaCircleUser } from "react-icons/fa6";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const isJobPoster = isAuthenticated && user?.role === 'job_poster';

  const linkClass = ({ isActive }) => {
    const baseClasses = "rounded-md px-3 py-2 transition-colors duration-100 hover:bg-[var(--hover)]";
    
    return isActive
    ? `${baseClasses} border-2 border-[var(--text)]`
    : `${baseClasses}`;
  }
  const handleLogout = () => {
    logout();
    window.location.reload();
  }

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [isMenuOpen]);

  return (
    <nav onClick={(e) => {
        if (e.target === e.currentTarget) setIsMenuOpen(false);
      }}
      className="bg-[var(--background)] dark:bg-dark-background shadow-md transition-colors duration-300 fixed w-full z-10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo + title */}
          <div className="flex items-center">
            <NavLink className="flex items-center" to="/">
            <FaReact className="text-4xl m-2"/>
              <span className="text-xl md:text-2xl md:block font-bold ml-2">
                React Jobs
              </span>
            </NavLink>
          </div>
          {/* ThemeToggle + Menu */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="md:hidden p-2 rounded-md text-[var(--text)] hover:bg-[var(--hover)]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <FaXmark size={24} />
              ) : (
                <FaBars size={24} />
              )}
            </button>
            <div className="hidden md:flex space-x-2 items-center">
              <NavLink to="/" className={linkClass}>
                Home
              </NavLink>
              <NavLink to="/jobs" className={linkClass}>
                Jobs
              </NavLink>
              {isAuthenticated ? (
                <>
                  {isJobPoster && (
                    <NavLink to="/add-job" className={linkClass}>
                      Add Job
                    </NavLink>
                  )}
                  <NavLink to="/profile" className={linkClass}>
                    <FaCircleUser className="inline-block mr-2" />
                    {user?.username}
                  </NavLink>
                  <div className="px-3 py-2 flex">
                    <button onClick={handleLogout}>
                      <FaRightFromBracket className="hover:text-[var(--red)]"/>
                    </button>
                  </div>
                </> 
              ) : (
                <>
                  <NavLink to="/register" className={linkClass}>
                    Register
                  </NavLink>
                  <NavLink to="/login" className={linkClass}>
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 p-4">
              <NavLink 
                to="/"
                className={`block ${linkClass({ isActive: false })}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </NavLink>
              <NavLink 
                to="/jobs" 
                className={`block ${linkClass({ isActive: false })}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Jobs
              </NavLink>
              {isAuthenticated ? (
                <>
                  {isJobPoster && (
                    <NavLink 
                      to="/add-job" 
                      className={`block ${linkClass({ isActive: false })}`}
                      onClick={() => setIsMenuOpen(false)}  
                    >
                      Add Job
                    </NavLink>
                  )}
                  <NavLink 
                    to="/profile" 
                    onClick={() => setIsMenuOpen(false)}
                    className={`block w-full text-left ${linkClass({
                      isActive: false,
                    })}`}
                  >
                    My Profile
                  </NavLink>
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className={`block w-full text-left ${linkClass({
                      isActive: false,
                    })}`}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink 
                    to="/register" 
                    className={`block ${linkClass({ isActive: false })}`}
                    onClick={() => setIsMenuOpen(false)}  
                  >
                    Register
                  </NavLink>
                  <NavLink 
                    to="/login" 
                    className={`block ${linkClass({ isActive: false })}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;