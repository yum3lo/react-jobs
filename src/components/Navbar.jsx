import logo from "../assets/images/logo.svg";
import { NavLink } from "react-router-dom";
import { FaRightFromBracket } from "react-icons/fa6";

const Navbar = ({isLoggedIn, setIsLoggedIn}) => {
  const linkClass = ({ isActive }) =>
    isActive
      ? "text-white bg-black hover:bg-indigo-300 rounded-md px-3 py-2"
      : "text-white hover:bg-indigo-300 rounded-md px-3 py-2";

  const handleLogout = () => {
    setIsLoggedIn(false);
    window.location.reload();
  }

  return (
    <nav className="bg-indigo-900">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              <img className="h-10 w-auto" src={logo} alt="React Jobs" />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                React Jobs
              </span>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/jobs" className={linkClass}>
                  Jobs
                </NavLink>
                {isLoggedIn ? (
                  <>
                    <NavLink to="/add-job" className={linkClass}>
                      Add Job
                    </NavLink>
                    <div className="flex justify-center items-center">
                      <NavLink
                        onClick={handleLogout} 
                        className="bg-orange-500 hover:bg-orange-600 rounded-md px-3 py-2"
                      >
                        <FaRightFromBracket className="text-white"/>
                      </NavLink>
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
    </nav>
  );
};

export default Navbar;
