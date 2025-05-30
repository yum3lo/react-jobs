import { useLoaderData, useNavigate, Link } from "react-router-dom"
import { FaArrowLeft, FaMapMarker } from "react-icons/fa";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import { useAuth } from "../context/AuthContext";

const JobPage = ({ deleteJob }) => {
  const navigate = useNavigate();
  const job = useLoaderData();
  const { isAuthenticated, user } = useAuth();

  const isJobPoster = isAuthenticated && user.role === 'job_poster';

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
              <div className="bg-[var(--background)] p-4 md:p-6 rounded-lg shadow-md text-center md:text-left">
                <div className="text-[var(--card)] mb-4">{job.type}</div>
                <h1 className="text-2xl md:text-3xl font-bold mb-4">
                  {job.title}
                </h1>
                <div className="text-[var(--red)]">
                  <FaMapMarker className="inline text-lg mb-1 mr-1" />
                  {job.location}
                </div>
              </div>

              <div className="bg-[var(--background)] p-4 md:p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-lg font-bold mb-2">
                  Job Description
                </h3>

                <p className="mb-4">{job.description}</p>

                <h3 className="text-lg font-bold mb-2">Salary</h3>

                <p>{job.salary} / Year</p>
              </div>
            </main>

            <aside>
              <div className="bg-[var(--background)] p-4 md:p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-4">Company Info</h3>

                <h2 className="text-2xl">{job.company.name}</h2>

                <p className="my-2">{job.company.description}</p>

                <hr className="my-4" />

                <h3 className="text-xl">Contact Email:</h3>

                <p className="my-2 bg-[var(--hover)] p-2 font-bold rounded-lg break-words text-sm">{job.company.contactEmail}</p>

                <h3 className="text-xl">Contact Phone:</h3>

                <p className="my-2 bg-[var(--hover)] p-2 font-bold rounded-lg break-words text-sm">{job.company.contactPhone}</p>
              </div>

              <div className="bg-[var(--background)] p-6 rounded-lg shadow-md mt-6 text-center">
                {isAuthenticated ? (
                  isJobPoster ? (
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
                      <p className="mb-3">To manage job listings you need a job poster account.</p>
                      <p className="text-sm text-gray-500">You're currently logged in as a job seeker.</p>
                    </div>
                  )
                ) : (
                  <> 
                    <p>To edit or delete the job</p>
                    <div className="inline">
                      <Link to={'/register'} className="underline text-[var(--red)]">Sign up</Link>
                      <span className="mx-2">or</span>
                      <Link to={'/login'} className="underline text-[var(--red)]">Sign in</Link>
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  )
}

const jobLoader = async ({params}) => {
  const res = await fetch(`${API_BASE_URL}/jobs/${params.id}`);
  const data = await res.json();
  return data;
}

export {JobPage as default, jobLoader}