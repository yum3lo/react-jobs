import { useState, useEffect } from "react";
import { useLoaderData, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaMapMarker } from "react-icons/fa";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import { useJobContext } from "../context/JobContext";
import Card from '../components/Card';
import ApplicationModal from "../components/ApplicationModal";
import ApplicationsList from "../components/ApplicationsList";
import Spinner from "../components/Spinner";
import { API_BASE_URL } from "../config";

const JobPage = () => {
  const { deleteJob } = useJobContext();
  const rawJobData = useLoaderData();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applications, setApplications] = useState([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  
  // because of 2 different formats of getting job data
  const normalizeJobData = (jobData) => {
    if (jobData.company && typeof jobData.company === 'object') {
      return jobData;
    }
  
    return {
      ...jobData,
      company: {
        name: jobData.company_name,
        description: jobData.company_description
      }
    };
  };

  const job = normalizeJobData(rawJobData);
  const isJobPoster = isAuthenticated && user.role === 'job_poster';
  const isJobSeeker = isAuthenticated && user.role === 'job_seeker';
  // check if current user is the job owner
  const isJobOwner = isAuthenticated && job.user_id === user.id;

  // fetching applications if the user is the job owner
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (isJobSeeker && isAuthenticated && user?.id) {
        try {
          const accessToken = localStorage.getItem('accessToken');
          const response = await fetch(`${API_BASE_URL}/jobs/${job.id}/check-application`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setHasApplied(data.hasApplied);
          }
        } catch (error) {
          throw error
        }
      }
    };

    const fetchApplications = async () => {
      if (isJobOwner) {
        setLoadingApplications(true);
        try {
          const accessToken = localStorage.getItem('accessToken');
          const response = await fetch(`${API_BASE_URL}/jobs/${job.id}/applications`, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setApplications(data.applications);
          }
        } catch (error) {
          throw error;
        } finally {
          setLoadingApplications(false);
        }
      }
    };

    checkApplicationStatus();
    fetchApplications();
  }, [job.id, isJobOwner, isJobSeeker, isAuthenticated, user?.id]);

  const onDeleteClick = async (jobId) => {
    const confirm = window.confirm('Are you sure you want to delete this job?');
    if (!confirm) return;
    try {
      await deleteJob(jobId);
      toast.success('Job deleted successfully!');
      navigate('/jobs');
    } catch (error) {
      toast.error('Error deleting job!');
    }
  }

  // handle job application submission
  const handleApply = async (formData) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/jobs/${job.id}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.error === 'You have already applied for this job') {
          setHasApplied(true);
          throw new Error(data.error);
        }
        throw new Error(data.error || 'Failed to submit application');
      }
      
      setHasApplied(true);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateApplicationStatus = async (appId, status) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/jobs/${job.id}/applications/${appId}`, {
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
      
      setApplications(applications.map(app => 
        app.id === appId ? { ...app, status } : app
      ));
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <section className="bg-[var(--card)]">
        <div className="container m-auto p-6">
          <Link
            to="/jobs"
            className="text-[var(--background)] hover:underline flex items-center"
          >
            <FaArrowLeft className="mr-2"/>
            Back to Job Listings
          </Link>
        </div>
      </section>

      <section className="bg-[var(--hover)]">
        <div className="container m-auto py-10 px-8">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            <main>
              <Card>
                <div className="text-[var(--card)] mb-4">{job.type}</div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {job.title}
                </h1>
                <div className="text-[var(--red)]">
                  <FaMapMarker className="inline text-lg mb-1 mr-1" />
                  {job.location}
                </div>

                {isJobSeeker && (
                  <div className="mt-6 pt-4 border-t border-[var(--hover)]">
                    {hasApplied ? (
                      <div className="text-sm md:text-base bg-green-100 text-green-800 p-3 rounded-md flex justify-between items-center">
                        <span>You have already applied for this job</span>
                        <Link
                          to="/profile"
                          className="text-xs md:text-sm underline hover:text-green-600"
                        >
                          View in profile
                        </Link>
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsApplyModalOpen(true)}
                        className="bg-[var(--text)] hover:bg-[var(--card)] text-[var(--background)] py-2 px-6 rounded-md"
                      >
                        Apply for This Job
                      </button>
                    )}
                  </div>
                )}
              </Card>

              <Card className="mt-6">
                <h3 className="text-lg font-bold mb-2">
                  Job Description
                </h3>
                <p className="mb-4">{job.description}</p>
                <h3 className="text-lg font-bold mb-2">Salary</h3>
                <p>{job.salary} / Year</p>
              </Card>

              {isJobOwner && (
                <Card className="mt-6">
                  <h3 className="text-lg font-bold mb-2">
                    Applications
                  </h3>
                  {loadingApplications ? (
                    <Spinner loading={true} />
                  ) : (
                    <ApplicationsList 
                      applications={applications} 
                      onUpdateStatus={handleUpdateApplicationStatus} 
                    />
                  )}
                </Card>
              )}
            </main>

            <aside>
              <Card>
                <h3 className="text-xl font-bold mb-4">Company Info</h3>
                <h2 className="text-2xl">{job.company.name}</h2>
                <p className="my-2">{job.company.description}</p>
              </Card>

              <Card className="mt-6 text-center">
                {isAuthenticated ? (
                  isJobPoster ? (
                    isJobOwner ? (
                      <>
                        <h3 className="text-xl font-bold mb-6">
                          Manage Job
                        </h3>
                        <Link
                          to={`/jobs/${job.id}/edit`}
                          className="bg-[var(--card)] hover:bg-[var(--text)] text-[var(--background)] text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                        >
                          Edit Job
                        </Link>
                        <button
                          className="bg-[var(--red)] hover:bg-[var(--dark-red)] text-[var(--background)] font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                          onClick={() => onDeleteClick(job.id)}
                        >
                          Delete Job
                        </button>
                      </>
                    ) : (
                      <div>
                        <p className="mb-3">You can only manage job listings that you created.</p>
                      </div>
                    )
                  ) : (
                    <div>
                      <p className="mb-3">To manage job listings you need a job poster account.</p>
                      <p className="text-sm text-gray-500">You're currently logged in as a job seeker.</p>
                    </div>
                  )
                ) : (
                  <> 
                    <p>To apply for this job</p>
                    <div className="inline">
                      <Link to={'/register'} className="underline text-[var(--red)]">Sign up</Link>
                      <span className="mx-2">or</span>
                      <Link to={'/login'} className="underline text-[var(--red)]">Sign in</Link>
                    </div>
                  </>
                )}
              </Card>
            </aside>
          </div>
        </div>
      </section>

      <ApplicationModal 
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        jobId={job.id}
        onSubmit={handleApply}
      />
    </>
  )
}

export {JobPage as default}