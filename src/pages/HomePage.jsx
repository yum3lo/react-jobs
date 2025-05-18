import Hero from "../components/Hero";
import HomeCards from "../components/HomeCards";
import JobListings from "../components/JobListings";
import ViewAllJobs from "../components/ViewAllJobs";
import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const { authState } = useAuth();
  return (
    <>
      <Hero />
      <HomeCards authState={authState}/>
      <JobListings isHome={true} />
      <ViewAllJobs />
    </>
  );
};

export default HomePage;
