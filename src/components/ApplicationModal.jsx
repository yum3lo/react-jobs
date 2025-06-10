import { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const ApplicationModal = ({ isOpen, onClose, jobId, onSubmit }) => {
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resume) {
      toast.error("Please upload your resume");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("coverLetter", coverLetter);
      
      await onSubmit(formData);
      
      setCoverLetter("");
      setResume(null);
      onClose();
      toast.success("Application submitted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-[var(--background)] rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Submit Your Application</h2>
          <button 
            onClick={onClose} 
            className="text-[var(--card)] hover:text-[var(--text)]"
          >
            <FaTimes />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">
              Upload Resume/CV (PDF, DOC, DOCX)
            </label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setResume(e.target.files[0])}
              className="w-full p-2 border border-[var(--hover)] rounded-md"
              required
            />
            {resume && (
              <p className="mt-2 text-sm text-green-600">
                Selected file: {resume.name}
              </p>
            )}
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium">
              Cover Letter / Message
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full p-2 border border-[var(--hover)] rounded-md min-h-[150px]"
              placeholder="Tell the employer why you're a good fit for this position..."
              required
            ></textarea>
          </div>
          
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 bg-[var(--hover)] py-2 px-4 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[var(--text)] text-[var(--background)] py-2 px-4 rounded-lg hover:bg-[var(--card)]"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplicationModal;