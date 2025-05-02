import { FaReact } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { FaRightFromBracket } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({isLoggedIn, setIsLoggedIn}) => {
  const linkClass = ({ isActive }) => {
    const baseClasses = "rounded-md px-3 py-2 transition-colors duration-100";
    
    return isActive
    ? `${baseClasses} border-2 border-[var(--text)] hover:bg-[var(--hover)]`
    : `${baseClasses} hover:bg-[var(--hover)]`;
  }
  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.reload();
  }

  return (
    <nav className="bg-[var(--background)] dark:bg-dark-background shadow-md transition-colors duration-300 fixed w-full z-10">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
            <FaReact className="text-4xl"/>
              <span className="hidden md:block text-2xl font-bold ml-2">
                React Jobs
              </span>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-2 items-center">
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/jobs" className={linkClass}>
                  Jobs
                </NavLink>

                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  {isLoggedIn ? (
                    <>
                      <NavLink to="/add-job" className={linkClass}>
                        Add Job
                      </NavLink>
                      <div className="px-3 py-2 flex">
                        <button onClick={handleLogout}>
                          <FaRightFromBracket className="text-[var(--text)] hover:text-[var(--red)]"/>
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
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;