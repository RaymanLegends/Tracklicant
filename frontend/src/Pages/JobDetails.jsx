import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { ArrowLeftIcon, LoaderIcon, Trash2Icon, ExternalLinkIcon } from "lucide-react";

const JobDetailsPage = () => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data);
      } catch (error) {
        console.error("Error fetching job application:", error);
        toast.error("Failed to fetch the application details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job application?")) return;

    try {
      await api.delete(`/jobs/${id}`);
      toast.success("Application deleted");
      navigate("/");
    } catch (error) {
      console.error("Error deleting job application:", error);
      toast.error("Failed to delete application");
    }
  };

  const handleSave = async () => {
    if (!job.position.trim() || !job.company.trim()) {
      toast.error("Position and Company are required");
      return;
    }

    setSaving(true);

    try {
      await api.put(`/jobs/${id}`, job);
      toast.success("Application updated successfully");
      navigate("/");
    } catch (error) {
      console.error("Error saving job application:", error);
      toast.error("Failed to update application");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4">
        <p className="text-lg">Application not found</p>
        <Link to="/" className="btn btn-primary">
          Back to Applications
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Top Actions */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost gap-2">
              <ArrowLeftIcon className="size-5" />
              Back to Applications
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline gap-2">
              <Trash2Icon className="size-5" />
              Delete Application
            </button>
          </div>

          <div className="card bg-base-100 shadow-sm border border-base-content/10">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Edit Application</h2>

              {/* Position */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Position Title *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer"
                  className="input input-bordered w-full"
                  value={job.position}
                  onChange={(e) => setJob({ ...job, position: e.target.value })}
                  required
                />
              </div>

              {/* Company */}
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text font-medium">Company Name *</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Google, Stripe"
                  className="input input-bordered w-full"
                  value={job.company}
                  onChange={(e) => setJob({ ...job, company: e.target.value })}
                  required
                />
              </div>

              {/* Location & Status (Side-by-side) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Location</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Remote, Chicago, IL"
                    className="input input-bordered w-full"
                    value={job.location || ""}
                    onChange={(e) => setJob({ ...job, location: e.target.value })}
                  />
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Application Status</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={job.appStatus || "Applied"}
                    onChange={(e) => setJob({ ...job, appStatus: e.target.value })}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Interviewing">Interviewing</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>

              {/* Job URL */}
              <div className="form-control mb-4">
                <div className="flex justify-between items-center pr-1">
                  <label className="label">
                    <span className="label-text font-medium">Job Posting URL</span>
                  </label>
                  {job.jobUrl && (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Open Link <ExternalLinkIcon className="size-3" />
                    </a>
                  )}
                </div>
                <input
                  type="url"
                  placeholder="https://linkedin.com/jobs/view/..."
                  className="input input-bordered w-full"
                  value={job.jobUrl || ""}
                  onChange={(e) => setJob({ ...job, jobUrl: e.target.value })}
                />
              </div>

              {/* Notes */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text font-medium">Notes & Details</span>
                </label>
                <textarea
                  placeholder="Salary info, interview rounds, recruiter contact..."
                  className="textarea textarea-bordered h-32 w-full"
                  value={job.notes || ""}
                  onChange={(e) => setJob({ ...job, notes: e.target.value })}
                />
              </div>

              {/* Submit */}
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary"
                  disabled={saving}
                  onClick={handleSave}
                >
                  {saving ? (
                    <>
                      <span className="loading loading-spinner loading-sm" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;