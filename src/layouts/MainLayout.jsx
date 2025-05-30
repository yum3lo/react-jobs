import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Preloader from "../components/Preloader";
import { ToastContainer } from "react-toastify";
import Footer from "../components/Footer";
import "react-toastify/dist/ReactToastify.css";

const MainLayout = () => {
  return (
    <>
      <Preloader/>
      <div className="h-[80px]">
        <Navbar />
      </div>
      <Outlet />
      <Footer />
      <ToastContainer />
    </>
  );
};

export default MainLayout;
