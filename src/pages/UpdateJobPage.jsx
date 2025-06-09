import { useParams, useLoaderData, useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"
import { FaStarOfLife } from "react-icons/fa"
import { useJobContext } from '../context/JobContext';
import Card from '../components/Card'

const EditJobPage = () => {
  const job = useLoaderData();
  const { updateJob } = useJobContext();
  const [title, setTitle] = useState(job.title)
  const [type, setType] = useState(job.type)
  const [location, setLocation] = useState(job.location)
  const [description, setDescription] = useState(job.description)
  const [salary, setSalary] = useState(job.salary)
  const [companyName, setCompanyName] = useState(job.company.name)
  const [companyDescription, setCompanyDescription] = useState(job.company.description)
  const [contactEmail, setContactEmail] = useState(job.company.contactEmail)
  const [contactPhone, setContactPhone] = useState(job.company.contactPhone)

  const navigate = useNavigate()
  const { id } = useParams();

  const submitForm = async (e) => {
    e.preventDefault();
    const updatedJob = {
      id,
      title,
      type,
      location,
      description,
      salary,
      company: {
        name: companyName,
        description: companyDescription,
        contactEmail,
        contactPhone
      }
    }
    
    try {
      await updateJob(updatedJob);
      toast.success('Job updated successfully!');
      navigate(`/jobs/${id}`);
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error(`Error: ${error.message || 'Failed to update job'}`);
    }
  }

  return (
    <section className="bg-[var(--hover)]">
      <div className="container m-auto max-w-2xl py-12 md:py-24">
        <Card>
          <form onSubmit={submitForm}>
            <h2 className="text-2xl md:text-3xl text-center font-semibold mb-6">Update Job</h2>

            <div className="mb-4">
              <label htmlFor="type" className="block font-bold mb-2">
                Job Type
                <FaStarOfLife className="text-[var(--red)] inline-block w-2 ml-1 mt-[-10px]" />
              </label>
              <select
                id="type"
                name="type"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                required
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-2">
                Job Listing Name 
                <FaStarOfLife className="text-[var(--red)] inline-block w-2 ml-1 mt-[-10px]" />
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="bg-[var(--hover)] rounded w-full py-2 px-3 mb-2"
                placeholder="eg. Junior React Developer"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block font-bold mb-2"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any job duties, expectations, requirements, etc"
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="type" className="block font-bold mb-2">
                Salary
                <FaStarOfLife className="text-[var(--red)] inline-block w-2 ml-1 mt-[-10px]" />
              </label>
              <select
                id="salary"
                name="salary"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                required
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
              >
                <option value="Under $50K">Under $50K</option>
                <option value="$50K - $60K">$50K - $60K</option>
                <option value="$60K - $70K">$60K - $70K</option>
                <option value="$70K - $80K">$70K - $80K</option>
                <option value="$80K - $90K">$80K - $90K</option>
                <option value="$90K - $100K">$90K - $100K</option>
                <option value="$100K - $125K">$100K - $125K</option>
                <option value="$125K - $150K">$125K - $150K</option>
                <option value="$150K - $175K">$150K - $175K</option>
                <option value="$175K - $200K">$175K - $200K</option>
                <option value="Over $200K">Over $200K</option>
              </select>
            </div>

            <div className='mb-4'>
              <label className="block font-bold mb-2">
                Location
              <FaStarOfLife className="text-[var(--red)] inline-block w-2 ml-1 mt-[-10px]" />
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="bg-[var(--hover)] rounded w-full py-2 px-3 mb-2"
                placeholder="Company Location"
                required  
                value={location}
                onChange={(e) => setLocation(e.target.value)}         
              />
            </div>

            <h3 className="text-2xl mb-5">Company Info</h3>

            <div className="mb-4">
              <label 
                htmlFor="company" 
                className="block font-bold mb-2"
              >
                Company Name
              </label>
              <input
                type="text"
                id="company"
                name="company"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="company_description"
                className="block font-bold mb-2"
              >
                Company Description
              </label>
              <textarea
                id="company_description"
                name="company_description"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                rows="4"
                placeholder="What does your company do?"
                value={companyDescription}
                onChange={(e) => setCompanyDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="contact_email"
                className="block font-bold mb-2"
              >
                Contact Email
                <FaStarOfLife className="text-[var(--red)] inline-block w-2 ml-1 mt-[-10px]" />
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                placeholder="Email address for applicants"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="contact_phone"
                className="block font-bold mb-2"
              >
                Contact Phone
              </label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                placeholder="Optional phone for applicants"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
              />
            </div>

            <div>
              <button
                className="bg-[var(--card)] text-[var(--background)] hover:bg-[var(--text)] font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Update Job
              </button>
            </div>
          </form>
        </Card>
      </div>
    </section>
  )
}

export default EditJobPage