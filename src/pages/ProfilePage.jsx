import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaCamera, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useJobContext } from "../context/JobContext";
import Card from "../components/Card";
import JobListing from "../components/JobListing";
import Spinner from "../components/Spinner";

const ProfilePage = () => {
  const { user, isAuthenticated, updateUserProfile } = useAuth();
  const { jobs, fetchUserJobs, loading } = useJobContext();
  const [userJobs, setUserJobs] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (isAuthenticated && user?.role === 'job_poster' && !jobsLoaded) {
      const loadUserJobs = async () => {
        try {
          const fetchedJobs = await fetchUserJobs(user.id);
          
          setUserJobs(fetchedJobs);
          setJobsLoaded(true); // to not fetch again
        } catch (error) {
          console.error('Error loading user jobs:', error);
          setUserJobs([]);
          setJobsLoaded(true);
        }
      };
      loadUserJobs();
    }
  }, [isAuthenticated, user, fetchUserJobs, jobsLoaded]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!profileImage) return;

    try {
      const formData = new FormData();
      formData.append('profileImage', profileImage);
      
      const updatedUser = await updateUserProfile(formData);
      setPreviewUrl(updatedUser.profileImageUrl);
      toast.success('Profile image updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile image');
      console.error(error);
    }
  };

  const nextJob = () => {
    setCurrentJobIndex((prev) => 
      prev === userJobs.length - 1 ? 0 : prev + 1
    );
  };

  const prevJob = () => {
    setCurrentJobIndex((prev) => 
      prev === 0 ? userJobs.length - 1 : prev - 1
    );
  };

  return (
    <section className="bg-[var(--hover)] py-10">
      <div className="container m-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="flex flex-col items-center">
            <div className="relative mb-5">
              <div className="w-40 h-40 rounded-full overflow-hidden bg-[var(--hover)] flex items-center justify-center">
                {previewUrl || user?.profileImageUrl ? (
                  <img 
                    src={previewUrl || user?.profileImageUrl} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                      toast.error('Failed to load profile image');
                    }}
                  />
                ) : (
                  <FaUser className="text-6xl text-[var(--card)]" />
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-[var(--card)] text-[var(--background)] rounded-full p-2"
              >
                <FaCamera />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                accept="image/*" 
                className="hidden"
              />
            </div>
            
            {profileImage && (
              <button 
                onClick={handleImageUpload}
                className="bg-[var(--card)] text-[var(--background)] py-2 px-4 rounded-lg mb-6 hover:bg-[var(--text)]"
              >
                Save Profile Picture
              </button>
            )}
            
            <h2 className="text-2xl font-bold mb-2">{user?.username || "User"}</h2>
            <span className="bg-[var(--card)] text-[var(--background)] px-3 py-1 rounded-full text-sm mb-4">
              {user?.role === 'job_poster' ? 'Job Poster' : 'Job Seeker'}
            </span>
            
            <div className="mt-4 w-full">
              <h3 className="text-xl font-semibold mb-2">Account Details</h3>
              <p className="mb-2"><strong>Email:</strong> {user?.email || "Not provided"}</p>
              <p className="mb-2"><strong>Number of Jobs Posted:</strong> {userJobs.length || 0}</p>
            </div>
          </Card>

          {/* Job Poster's Jobs or Job Seeker Info */}
          <Card>
            {user?.role === 'job_poster' ? (
              <div className="h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-4">Your Job Listings</h2>
                
                {loading ? (
                  <Spinner loading={true} />
                ) : userJobs.length > 0 ? (
                  <>
                    <div className="flex-grow relative overflow-hidden mb-4">
                      
                      {/* This approach renders ALL job listings and positions them side by side */}
                      <div className="flex w-full">
                        {userJobs.map((job, index) => (
                          <div 
                            key={job.id} 
                            className="w-full flex-shrink-0"
                            style={{ 
                              display: index === currentJobIndex ? 'block' : 'none'
                            }}
                          >
                            <JobListing job={userJobs[currentJobIndex]} noShadow={true} border={true} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <button 
                        onClick={prevJob} 
                        className="bg-[var(--card)] text-[var(--background)] hover:bg-[var(--text)] p-2 rounded-full"
                        disabled={userJobs.length <= 1}
                      >
                        <FaArrowLeft />
                      </button>
                      <span>{currentJobIndex + 1} of {userJobs.length}</span>
                      <button 
                        onClick={nextJob} 
                        className="bg-[var(--card)] text-[var(--background)] hover:bg-[var(--text)] p-2 rounded-full"
                        disabled={userJobs.length <= 1}
                      >
                        <FaArrowRight />
                      </button>
                    </div>
                    
                    <Link 
                      to="/add-job"
                      className="bg-[var(--text)] text-[var(--background)] text-center py-2 px-4 rounded-lg mt-6 hover:bg-[var(--red)]"
                    >
                      Add New Job
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <p className="mb-6 text-center">You haven't posted any jobs yet.</p>
                    <Link 
                      to="/add-job"
                      className="bg-[var(--text)] text-[var,--background)] py-2 px-4 rounded-lg hover:bg-[var(--card)]"
                    >
                      Post Your First Job
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col justify-center items-center">
                <h2 className="text-2xl font-bold mb-4">Job Seeker Profile</h2>
                <p className="mb-6 text-center">Track your job applications and saved jobs.</p>
                <Link 
                  to="/jobs"
                  className="bg-[var(--text)] text-[var(--background)] py-2 px-4 rounded-lg hover:bg-[var(--card)]"
                >
                  Browse Available Jobs
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;