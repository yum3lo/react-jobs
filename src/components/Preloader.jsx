import { useEffect, useState } from "react";
import logo from "../assets/images/logo.svg";

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-indigo-900 z-50 preloader-pulse">
        <div className="text-center">
          <img src={logo} alt="React Jobs Logo" className="h-20 w-auto mx-auto mb-4" />
          <h1 className="text-white text-4xl font-bold">React Jobs</h1>
        </div>
      </div>
    );
  }

  return null;
};

export default Preloader;