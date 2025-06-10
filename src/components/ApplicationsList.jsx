import { useState } from "react";
import { FaDownload, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const ApplicationsList = ({ applications, onUpdateStatus }) => {
  const [expandedApp, setExpandedApp] = useState(null);

  const toggleExpand = (appId) => {
    setExpandedApp(expandedApp === appId ? null : appId);
  };

  const handleStatusUpdate = async (appId, status) => {
    try {
      await onUpdateStatus(appId, status);
      toast.success(`Application ${status === 'approved' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      toast.error(`Failed to ${status} application`);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'approved': return 'text-green-600';
      case 'rejected': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  if (applications.length === 0) {
    return <p className="text-center py-6">No applications yet.</p>;
  }

  return (
    <div className="mt-4">
      <div className="space-y-4">
        {applications.map(app => (
          <div 
            key={app.id}
            className="border border-[var(--hover)] rounded-lg p-4"
          >
            <div 
              className="flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(app.id)}
            >
              <div className="flex items-center">
                {app.profile_image_url ? (
                  <img 
                    src={app.profile_image_url} 
                    alt={app.username}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '';
                    }}
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[var(--card)] text-[var(--background)] flex items-center justify-center mr-3">
                    {app.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-medium">{app.username}</h4>
                  <p className="text-xs md:text-sm text-gray-500">
                    Applied on {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className={`text-sm md:text-base ${getStatusClass(app.status)}`}>
                {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>
            
            {expandedApp === app.id && (
              <div className="mt-4 border-t pt-4">
                <h5 className="font-medium mb-2">Cover Letter:</h5>
                <p className="mb-4 whitespace-pre-wrap">{app.cover_letter}</p>
                
                {app.resume_path && (
                  <a 
                    href={app.resume_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-[var(--hover)] hover:bg-[var(--card)] hover:text-[var(--background)] py-1 px-3 rounded-md mb-4"
                  >
                    <FaDownload className="mr-2" /> View Resume
                  </a>
                )}
                
                {app.status === 'pending' && (
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'approved')}
                      className="flex items-center bg-green-100 text-green-800 hover:bg-green-200 py-1 px-3 rounded-md"
                    >
                      <FaCheckCircle className="mr-1" /> Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(app.id, 'rejected')}
                      className="flex items-center bg-red-100 text-red-800 hover:bg-red-200 py-1 px-3 rounded-md"
                    >
                      <FaTimesCircle className="mr-1" /> Reject
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsList;