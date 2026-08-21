import React from 'react'
import {useState, useEffect} from "react";
import { ArrowLeftIcon } from "lucide-react";
import { Link, useNavigate } from "react-router";
import toast from "react-hot-toast";
import api from '../lib/axios';
import axios from 'axios';

const CreatePage = () => {

  const [formData, setFormData] = useState({
    position: "",
    company: "",
    location: "", 
    appStatus: "Applied",
    jobUrl: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async(e) => {
    e.preventDefault();
    
    if (!formData.position.trim() || !formData.company.trim()) {
      toast.error("Company and Position are required", {
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try{
      await api.post("/jobs", formData);

      toast.success("Job application created successfully", {duration: 3000});
      navigate("/");
    }catch (error) {
      if (error.response?.status === 429) {
        toast.error("Slow down!", {duration:3000});
      } else {
        toast.error("Failed to submit job application", {duration:3000});
      }
      console.log("error submitting job application: ", error);
    }finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Link to="/" className="btn btn-ghost mb-6 gap-2">
            <ArrowLeftIcon className="size-5" />
            Back to Applications
          </Link>

          <div className="card bg-base-100 shadow-sm border border-base-content/10">
            <div className="card-body">
              <h2 className="card-title text-2xl mb-4">Track New Application</h2>
              
              <form onSubmit={handleSubmit}>

                {/* Company */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Company Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google, Stripe"
                    className="input input-bordered w-full"
                    value={formData.company}
                    onChange={(e) =>
                      setFormData({ ...formData, company: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Position */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Position Title *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer"
                    className="input input-bordered w-full"
                    value={formData.position}
                    onChange={(e) =>
                      setFormData({ ...formData, position: e.target.value })
                    }
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
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Application Status</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={formData.appStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, appStatus: e.target.value })
                      }
                    >
                      <option value="Applied">Applied</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Offer">Offer</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </div>
                </div>

                {/* Job Posting URL */}
                <div className="form-control mb-4">
                  <label className="label">
                    <span className="label-text font-medium">Job Posting URL</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://linkedin.com/jobs/view/..."
                    className="input input-bordered w-full"
                    value={formData.jobUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, jobUrl: e.target.value })
                    }
                  />
                </div>

                {/* Notes */}
                <div className="form-control mb-6">
                  <label className="label">
                    <span className="label-text font-medium">Notes & Details</span>
                  </label>
                  <textarea
                    placeholder="Salary info, interview rounds, recruiter contact..."
                    className="textarea textarea-bordered h-28 w-full"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>

                {/* Submit */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm" />
                        Saving...
                      </>
                    ) : (
                      "Save Application"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreatePage
