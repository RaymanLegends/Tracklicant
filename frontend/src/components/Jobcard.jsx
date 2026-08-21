import React from 'react';
import { PenSquareIcon, Trash2Icon } from 'lucide-react';
import { Link } from 'react-router';
import api from '../lib/axios';
import toast from 'react-hot-toast';

const JobCard = ({ job, setJobs }) => {
  if (!job) return null;

  const formattedDate = job.createdAt
    ? new Date(job.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

    const handleDelete = async(e, id) => {
      e.preventDefault();
      e.stopPropagation();

      if (!window.confirm("Are you sure you want to delete this application?")) return;

      try {
        await api.delete(`/jobs/${job._id}`);
        setJobs((prev) => prev.filter(job => job._id !== id));
        toast.success("Job Application deleted", {duration:3000});
      } catch(error) {
        toast.error("Failed to delete application", {duration:3000});
        console.log("Error in handleDelete: ", error);
      }
    }

  return ( 
    <Link
      to={`/job/${job._id}`}
      className="card bg-base-100 hover:shadow-lg transition-all duration-200 border-t-4 border-solid border-primary border-x border-b border-base-content/10"
    >
      <div className="card-body p-5 flex flex-col justify-between h-full">
        <div>
          {/* Header: Position & Status Badge */}
          <div className="flex justify-between items-start gap-2">
            <h3 className="card-title text-base-content text-lg line-clamp-1">
              {job.company || 'Untitled Position'}
            </h3>
            <span className="badge badge-neutral badge-sm capitalize shrink-0 p-3">
              {job.appStatus || 'Applied'}
            </span>
          </div>

          {/* Company & Location */}
          <p className="text-sm text-base-content/70 mt-1">
            {job.position} {job.location ? `• ${job.location}` : ''}
          </p>

          {/* Notes preview */}
          {job.notes && (
            <p className="text-xs text-base-content/60 line-clamp-2 mt-2">
              {job.notes}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="card-actions justify-between items-center mt-4 pt-2 border-t border-base-content/10">
          {/* Bottom-Left: Created Date */}
          <span className="text-xs text-base-content/50">
            {formattedDate}
          </span>

          {/* Bottom-Right: Slot for actions / buttons / badges */}
          <div className="flex items-center gap-3">
            <PenSquareIcon className="size-4"/>
            <button className="btn btn-ghost btn-xs text-error" onClick={(e) => {
              handleDelete(e, job._id);
            }}>
              <Trash2Icon className="size-4"/>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;