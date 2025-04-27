import { useState } from "react";
import { FaMapMarker } from "react-icons/fa";
import { Link } from "react-router-dom";

const JobListing = ({ job }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  let description = job.description;

  if (!showFullDescription) {
    let cutOffIndex = description.substring(0, 120).lastIndexOf(" ");
    if (cutOffIndex === -1) {
      cutOffIndex = 120;
    }
    description = description.substring(0, cutOffIndex) + "...";
  }

  return (
    <div className="bg-[var(--background)] rounded-xl shadow-md relative">
      <div className="py-4 px-6">

        <div className="mb-6">
          <div className="text-[var(--card)] my-2">{job.type}</div>
          <h3 className="text-xl font-bold">{job.title}</h3>
        </div>

        <div className="mb-3 text-justify text-m">{description}</div>

        <button
          onClick={() => setShowFullDescription((prevState) => !prevState)}
          className="text-[var(--red)] b-5 hover:underline mb-3"
        >
          {showFullDescription ? "Show less" : "Show more"}
        </button>

        <h3 className="text-[var(--card)] mb-2">{job.salary} / Year</h3>

        <div className="border border-[var(--card)] mb-5"></div>

        <div className="flex flex-col lg:flex-row justify-between mb-4">
          <div className="text-[var(--red)] mb-3">
            <FaMapMarker className="inline text-lg mb-1 mr-1" />
            {job.location}
          </div>
          <Link
            to={`/jobs/${job.id}`}
            className="h-[36px] bg-[var(--primary)] hover:bg-[var(--card)] text-[var(--background)] p-2 rounded-lg text-center text-sm"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobListing;
