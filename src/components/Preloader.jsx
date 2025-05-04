import { useEffect, useState } from "react";
import { FaReact } from "react-icons/fa";

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
      <div className="fixed inset-0 flex items-center justify-center z-50 preloader-pulse">
        <div className="text-center">
          <div className="mb-4 justify-center flex items-center">
            <FaReact className="text-7xl" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">React Jobs</h1>
        </div>
      </div>
    );
  }

  return null;
};

export default Preloader;