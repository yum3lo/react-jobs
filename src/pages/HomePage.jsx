import Hero from "../components/Hero";
import HomeCards from "../components/HomeCards";
import JobListings from "../components/JobListings";
import ViewAllJobs from "../components/ViewAllJobs";

const HomePage = ({ isLoggedIn }) => {
  return (
    <>
      <Hero />
      <HomeCards isLoggedIn={isLoggedIn}/>
      <JobListings isHome={true} />
      <ViewAllJobs />
    </>
  );
};

export default HomePage;
