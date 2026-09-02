import React from 'react';
import { PenSquareIcon, Trash2Icon, MapPinIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const JobCard = ({ job, setJobs }) => {
  const navigate = useNavigate();
  if (!job) return null;

  // Status configs for badges and border accents
  const statusConfig = {
    Applied: {
      pill: 'bg-sky-500/15 text-sky-600 border-sky-500/30',
      border: 'border-l-sky-500',
    },
    Interviewing: {
      pill: 'bg-amber-500/15 text-amber-600 border-amber-500/30',
      border: 'border-l-amber-500',
    },
    Offer: {
      pill: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30',
      border: 'border-l-emerald-500',
    },
    Rejected: {
      pill: 'bg-rose-500/15 text-rose-600 border-rose-500/30',
      border: 'border-l-rose-500',
    },
  };

  const currentStatus = statusConfig[job.appStatus] || statusConfig.Applied;

  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await api.delete(`/jobs/${job._id}`);
      setJobs((prev) => prev.filter((j) => j._id !== id));
      toast.success('Job application deleted', { duration: 3000 });
    } catch (error) {
      toast.error('Failed to delete application', { duration: 3000 });
      console.error('Error in handleDelete: ', error);
    }
  };

  const handleStatusChange = async (e) => {
    e.stopPropagation();
    const newStatus = e.target.value;
    try {
      await api.put(`/jobs/${job._id}`, { appStatus: newStatus });
      setJobs((prev) =>
        prev.map((j) => (j._id === job._id ? { ...j, appStatus: newStatus } : j))
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  return (
    <div
      onClick={() => navigate(`/job/${job._id}`)}
      className={`group card bg-base-100 border border-base-content/10 border-l-4 ${currentStatus.border} 
                 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer`}
    >
      <div className="card-body p-5 flex flex-col justify-between h-full">
        <div>
          {/* Header: Company & Status Selector */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="card-title text-base-content text-base font-semibold tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
              {job.company || 'Untitled Company'}
            </h3>

            {/* Styled Status Dropdown acting as a Pill */}
            <div onClick={(e) => e.stopPropagation()}>
              <select
                className={`select select-xs rounded-full font-medium border text-xs focus:outline-none cursor-pointer ${currentStatus.pill}`}
                value={job.appStatus || 'Applied'}
                onChange={handleStatusChange}
              >
                <option value="Applied">Applied</option>
                <option value="Interviewing">Interviewing</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Position & Location */}
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-base-content/70">
            <span className="font-medium text-base-content/85">{job.position || 'Applicant'}</span>
            {job.location && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-0.5 text-base-content/60">
                  <MapPinIcon className="size-3" />
                  {job.location}
                </span>
              </>
            )}
          </div>

          {/* Notes Preview */}
          {job.notes && (
            <p className="text-xs text-base-content/60 line-clamp-2 mt-3 bg-base-200/50 p-2 rounded border border-base-content/5">
              {job.notes}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="card-actions justify-between items-center mt-4 pt-3 border-t border-base-content/5">
          <span className="text-[11px] font-medium text-base-content/40 uppercase tracking-wider">
            {formattedDate}
          </span>

          {/* Action Buttons */}
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              className="btn btn-ghost btn-xs btn-circle text-base-content/60 hover:text-primary hover:bg-base-200"
              title="View / Edit"
              onClick={() => navigate(`/job/${job._id}`)}
            >
              <PenSquareIcon className="size-3.5" />
            </button>
            <button
              className="btn btn-ghost btn-xs btn-circle text-base-content/40 hover:text-error hover:bg-error/10"
              title="Delete"
              onClick={(e) => handleDelete(e, job._id)}
            >
              <Trash2Icon className="size-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;