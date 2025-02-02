import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <>
      <Preloader/>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
      <Outlet />
      <ToastContainer />
    </>
  );
};

export default MainLayout;
