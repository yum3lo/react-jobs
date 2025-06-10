import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUser, FaCamera, FaArrowLeft, FaArrowRight, FaExternalLinkAlt, FaCheckCircle, FaTimesCircle, FaTrash } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import { useJobContext } from "../context/JobContext";
import Card from "../components/Card";
import JobListing from "../components/JobListing";
import Spinner from "../components/Spinner";
import { API_BASE_URL } from "../config";

const ProfilePage = () => {
  const { user, isAuthenticated, updateUserProfile, deleteUserProfileImage } = useAuth();
  const { jobs, fetchUserJobs, loading } = useJobContext();
  const [userJobs, setUserJobs] = useState([]);
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const fileInputRef = useRef();
  
  const [userApplications, setUserApplications] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [applicationsLoading, setApplicationsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'job_poster' && !jobsLoaded) {
      const loadUserJobs = async () => {
        try {
          const fetchedJobs = await fetchUserJobs(user.id);
          
          setUserJobs(fetchedJobs);
          setJobsLoaded(true); // to not fetch again
        } catch (error) {
          setUserJobs([]);
          setJobsLoaded(true);
          throw error;
        }
      };
      loadUserJobs();
    }
  }, [isAuthenticated, user, fetchUserJobs, jobsLoaded]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const fetchApplicationData = async () => {
      setApplicationsLoading(true);
      try {
        const accessToken = localStorage.getItem('accessToken');
        
        if (user.role === 'job_seeker') {
          const response = await fetch(`${API_BASE_URL}/users/applications`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserApplications(data.applications || []);
          }
        } else if (user.role === 'job_poster') {
          const response = await fetch(`${API_BASE_URL}/users/pending-applications`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setPendingApplications(data.applications || []);
          }
        }
      } catch (error) {
        throw error;
      } finally {
        setApplicationsLoading(false);
      }
    };
    
    fetchApplicationData();
  }, [isAuthenticated, user]);

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
      
      const loadingToast = toast.loading('Uploading profile image...');
      const updatedUser = await updateUserProfile(formData);

      toast.update(loadingToast, { 
        render: "Profile image updated successfully!", 
        type: "success", 
        isLoading: false,
        autoClose: 3000
      });

      setPreviewUrl(updatedUser.profileImageUrl);
      setTimeout(() => {
        setProfileImage(null);
      }, 1000);
    } catch (error) {
      toast.error('Failed to update profile image');
    }
  };

  const handleDeleteImage = async () => {
    if (!user?.profileImageUrl) return;
    
    try {
      await deleteUserProfileImage();
      setPreviewUrl(null);
      toast.success('Profile image deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete profile image');
    }
  };

  const handleUpdateApplicationStatus = async (jobId, appId, status) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/applications/${appId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update application status');
      }
      
      setPendingApplications(pendingApplications.filter(app => app.id !== appId));
      toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} application`);
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

  const getStatusClasses = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const renderJobSeekerApplications = () => {
    if (applicationsLoading) {
      return <Spinner loading={true} />;
    }
    
    if (userApplications.length === 0) {
      return (
        <div className="text-center py-4">
          <p className="mb-6">You haven't applied to any jobs yet.</p>
          <Link 
            to="/jobs"
            className="bg-[var(--text)] text-[var(--background)] py-2 px-4 rounded-lg hover:bg-[var(--card)]"
          >
            Browse Available Jobs
          </Link>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg mb-2">Your Applications</h3>
        {userApplications.map(app => (
          <div key={app.id} className="border border-[var(--hover)] p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-bold">{app.job_title}</h4>
                <p className="text-sm">{app.company_name}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusClasses(app.status)}`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Applied on: {new Date(app.created_at).toLocaleDateString()}
            </p>
            <Link 
              to={`/jobs/${app.job_id}`}
              className="mt-3 text-sm flex items-center text-[var(--card)] hover:text-[var(--text)]"
            >
              View Job <FaExternalLinkAlt className="ml-1" size={12} />
            </Link>
          </div>
        ))}
      </div>
    );
  };

  const renderJobPosterPendingApplications = () => {
    if (applicationsLoading) {
      return <Spinner loading={true} />;
    }
    
    if (pendingApplications.length === 0) {
      return (
        <div className="text-center py-4">
          <p>No pending applications to review.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg mb-2">Pending Applications</h3>
        {pendingApplications.map(app => (
          <div key={app.id} className="border border-[var(--hover)] p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold">{app.job_title}</h4>
                <p className="text-sm">Applicant: {app.applicant_name}</p>
                <p className="text-sm text-gray-600">
                  Applied on: {new Date(app.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link 
                  to={`/jobs/${app.job_id}`}
                  className="text-xs p-1 hover:text-[var(--text)]"
                  title="View Job"
                >
                  <FaExternalLinkAlt />
                </Link>
              </div>
            </div>
            
            {app.cover_letter && (
              <div className="mt-3 mb-3">
                <p className="text-xs text-gray-600">Cover Letter:</p>
                <p className="text-sm bg-[var(--hover)] p-2 rounded-md mt-1">
                  {app.cover_letter.length > 100 
                    ? app.cover_letter.substring(0, 100) + '...' 
                    : app.cover_letter}
                </p>
              </div>
            )}
            
            {app.resume_path && (
              <a 
                href={app.resume_path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[var(--card)] hover:text-[var(--text)] flex items-center mt-2 mb-2"
              >
                View Resume <FaExternalLinkAlt className="ml-1" size={10} />
              </a>
            )}
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => handleUpdateApplicationStatus(app.job_id, app.id, 'approved')}
                className="flex items-center bg-green-100 text-green-800 hover:bg-green-200 py-1 px-2 rounded text-xs"
              >
                <FaCheckCircle className="mr-1" /> Approve
              </button>
              <button
                onClick={() => handleUpdateApplicationStatus(app.job_id, app.id, 'rejected')}
                className="flex items-center bg-red-100 text-red-800 hover:bg-red-200 py-1 px-2 rounded text-xs"
              >
                <FaTimesCircle className="mr-1" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="bg-[var(--hover)] py-10">
      <div className="container m-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <main>
            <Card className="flex flex-col items-center">
              <div className="relative mb-5">
                <div className="w-40 h-40 rounded-full overflow-hidden bg-[var(--hover)] flex items-center justify-center">
                  {previewUrl || user?.profileImageUrl ? (
                    <img
                      key={user?.profileImageUrl || 'no-image'} // to force re-render on image change
                      src={previewUrl || user?.profileImageUrl} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                      }}
                    />
                  ) : (
                    <FaUser className="text-6xl text-[var(--card)]" />
                  )}
                </div>
                
                <div className="absolute bottom-0 right-0 flex space-x-2">
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="bg-[var(--card)] text-[var(--background)] rounded-full p-2"
                    title="Change profile picture"
                  >
                    <FaCamera />
                  </button>
                  
                  {(previewUrl || user?.profileImageUrl) && (
                    <button 
                      onClick={handleDeleteImage}
                      className="bg-[var(--red)] text-[var(--background)] rounded-full p-2"
                      title="Delete profile picture"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
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
                <p className="mb-2">
                  <strong>Member since:</strong> {user?.created_at ? 
                    new Date(user.created_at).toLocaleDateString('en-US', {
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric'
                    }) : 
                    "Not available"}
                </p>
                {user?.role === 'job_poster' ? (
                  <p className="mb-2"><strong>Number of Jobs Posted:</strong> {userJobs.length || 0}</p>
                ) : (
                  <p className="mb-2"><strong>Number of Applications:</strong> {userApplications.length || 0}</p>
                )}
              </div>
            </Card>
            { user?.role === 'job_poster' ? (
              <Card className="mt-6">
                <h2 className="text-xl font-bold mb-4 items-center flex">
                  Applications to Review
                  {pendingApplications.length > 0 && (
                    <span className="ml-2 bg-[var(--red)] text-white text-sm py-0.5 px-2 rounded-full">
                      {pendingApplications.length}
                    </span>
                  )}
                </h2>
                {renderJobPosterPendingApplications()}
              </Card>
            ) : null}
          </main>

          <aside>
            <Card>
              {user?.role === 'job_poster' ? (
                <div className="h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">Your Job Listings</h2>
                  
                  {loading ? (
                    <Spinner loading={true} />
                  ) : userJobs.length > 0 ? (
                    <>
                      <div className="flex-grow relative overflow-hidden mb-4">
                        
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
                        className="bg-[var(--text)] text-[var(--background)] py-2 px-4 rounded-lg hover:bg-[var(--card)]"
                      >
                        Post Your First Job
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <h2 className="text-2xl font-bold mb-4">Job Seeker Profile</h2>
                  
                  {renderJobSeekerApplications()}
                </div>
              )}
            </Card>
          </aside>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;