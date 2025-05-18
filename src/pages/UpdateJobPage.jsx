import { useParams, useLoaderData, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { toast } from "react-toastify"
import { FaStarOfLife } from "react-icons/fa"

const UpdateJobPage = ({ updateJobSubmit }) => {
  const job = useLoaderData();
  const [formData, setFormData] = useState({
    title: job.title,
    type: job.type,
    location: job.location,
    description: job.description,
    salary: job.salary,
    companyName: job.company.name,
    companyDescription: job.company.description,
    contactEmail: job.company.contactEmail,
    contactPhone: job.company.contactPhone
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate()
  const { id } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updatedJob = {
      id,
      title: formData.title,
      type: formData.type,
      location: formData.location,
      description: formData.description,
      salary: formData.salary,
      company: {
        name: formData.companyName,
        description: formData.companyDescription,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone
      }
    };

    try {
      await updateJobSubmit(updatedJob);
      toast.success('Job updated successfully!');
      navigate(`/jobs/${id}`)
    } catch (error) {
      toast.error('Failed to update job');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="bg-[var(--hover)]">
      <div className="container m-auto max-w-2xl py-12 md:py-24">
        <div className="bg-[var(--background)] px-6 py-8 shadow-md rounded-md m-8 md:m-0">
          <form onSubmit={submitForm}>
            <h2 className="text-2xl md:text-3xl text-center font-semibold mb-6">Update Job</h2>

            <div className="mb-4">
              <label htmlFor="type" className="block font-bold mb-2">
                Job Type
                <Required />
              </label>
              <select
                id="type"
                name="type"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                required
                value={formData.type}
                onChange={handleChange}
                disabled={isSubmitting}
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
                <Required />
              </label>
              <input
                type="text"
                id="title"
                name="title"
                className="bg-[var(--hover)] rounded w-full py-2 px-3 mb-2"
                placeholder="eg. Junior React Developer"
                required
                value={formData.title}
                onChange={handleChange}
                disabled={isSubmitting}
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
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any job duties, expectations, requirements, etc"
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor="type" className="block font-bold mb-2">
                Salary
                <Required />
              </label>
              <select
                id="salary"
                name="salary"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                required
                value={formData.salary}
                onChange={handleChange}
                disabled={isSubmitting}
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
              <Required />
              </label>
              <input
                type="text"
                id="location"
                name="location"
                className="bg-[var(--hover)] rounded w-full py-2 px-3 mb-2"
                placeholder="Company Location"
                required  
                value={formData.location}
                onChange={handleChange}
                disabled={isSubmitting}         
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
                value={formData.companyName}
                onChange={handleChange}
                disabled={isSubmitting}
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
                value={formData.companyDescription}
                onChange={handleChange}
                disabled={isSubmitting}
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="contact_email"
                className="block font-bold mb-2"
              >
                Contact Email
                <Required />
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                className="bg-[var(--hover)] rounded w-full py-2 px-3"
                placeholder="Email address for applicants"
                required
                value={formData.contactEmail}
                onChange={handleChange}
                disabled={isSubmitting}
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
                value={formData.contactPhone}
                onChange={handleChange}
                disabled={isSubmitting}
              />
            </div>

            <div>
              <button
                className={`bg-[var(--card)] text-[var(--background)] font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[var(--text)]'}`}
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Updating Job...' : 'Update Job'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}

const Required = () => (
  <FaStarOfLife className="text-[var(--red)] inline-block w-2 ml-1 mt-[-10px]" />
);

export default UpdateJobPage