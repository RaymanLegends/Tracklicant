import React, { useState, useEffect, useMemo } from "react";
import { 
  BriefcaseIcon, 
  ClockIcon, 
  CheckCircle2Icon, 
  XCircleIcon, 
  SearchIcon, 
  LayersIcon,
  ArrowUpDownIcon
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import JobCard from "../components/Jobcard.jsx";
import AppsNotFound from "../components/AppsNotFound.jsx";
import api from "../lib/axios.js";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load job applications");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  // Compute live metrics for the 5 categories
  const stats = useMemo(() => {
    const total = jobs.length;
    const inReview = jobs.filter((j) => (j.appStatus || "Applied") === "Applied").length;
    const rounds = jobs.filter((j) => j.appStatus === "Interviewing").length;
    const offers = jobs.filter((j) => j.appStatus === "Offer").length;
    const rejections = jobs.filter((j) => j.appStatus === "Rejected").length;
    return { total, inReview, rounds, offers, rejections };
  }, [jobs]);

  // Filter & Sort Logic
  const filteredJobs = useMemo(() => {
    return jobs
      .filter((job) => {
        const matchesSearch =
          (job.company?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (job.position?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (job.location?.toLowerCase() || "").includes(searchQuery.toLowerCase());

        const matchesStatus =
          selectedStatus === "ALL" || job.appStatus === selectedStatus;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === "NEWEST") {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === "OLDEST") {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === "COMPANY") {
          return (a.company || "").localeCompare(b.company || "");
        }
        return 0;
      });
  }, [jobs, searchQuery, selectedStatus, sortBy]);

  return (
    <div className="min-h-screen bg-base-200/40 text-base-content antialiased">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* --- 1. ENTERPRISE HEADER & TITLE --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-base-content/10 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-base-content font-mono">
              Pipeline Overview
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              Track candidate status, interview progression, and offer milestones.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-lg badge-primary badge-outline font-mono font-bold">
              {stats.total} Total Tracked
            </span>
          </div>
        </div>

        {/* --- 2. 5-CARD KPI METRICS BAR --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          
          {/* 1. All Applications */}
          <div
            onClick={() => setSelectedStatus("ALL")}
            className={`stats shadow-xs bg-base-100 border rounded-2xl p-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              selectedStatus === "ALL"
                ? "border-primary ring-2 ring-primary/20 bg-primary/5"
                : "border-base-content/10 hover:border-primary/40"
            }`}
          >
            <div className="stat p-3">
              <div className="stat-figure text-primary">
                <BriefcaseIcon className="size-5 opacity-80" />
              </div>
              <div className="stat-title text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                All Applications
              </div>
              <div className="stat-value text-xl font-mono">{stats.total}</div>
              <div className="stat-desc text-[11px] text-base-content/50">Total tracked</div>
            </div>
          </div>

          {/* 2. In Review */}
          <div
            onClick={() => setSelectedStatus(selectedStatus === "Applied" ? "ALL" : "Applied")}
            className={`stats shadow-xs bg-base-100 border rounded-2xl p-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              selectedStatus === "Applied"
                ? "border-info ring-2 ring-info/20 bg-info/5"
                : "border-base-content/10 hover:border-info/40"
            }`}
          >
            <div className="stat p-3">
              <div className="stat-figure text-info">
                <ClockIcon className="size-5 opacity-80" />
              </div>
              <div className="stat-title text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                In Review
              </div>
              <div className="stat-value text-xl font-mono text-info">{stats.inReview}</div>
              <div className="stat-desc text-[11px] text-base-content/50">Awaiting response</div>
            </div>
          </div>

          {/* 3. Rounds */}
          <div
            onClick={() => setSelectedStatus(selectedStatus === "Interviewing" ? "ALL" : "Interviewing")}
            className={`stats shadow-xs bg-base-100 border rounded-2xl p-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              selectedStatus === "Interviewing"
                ? "border-warning ring-2 ring-warning/20 bg-warning/5"
                : "border-base-content/10 hover:border-warning/40"
            }`}
          >
            <div className="stat p-3">
              <div className="stat-figure text-warning">
                <LayersIcon className="size-5 opacity-80" />
              </div>
              <div className="stat-title text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Rounds
              </div>
              <div className="stat-value text-xl font-mono text-warning">{stats.rounds}</div>
              <div className="stat-desc text-[11px] text-base-content/50">Interview pipeline</div>
            </div>
          </div>

          {/* 4. Offer Extended */}
          <div
            onClick={() => setSelectedStatus(selectedStatus === "Offer" ? "ALL" : "Offer")}
            className={`stats shadow-xs bg-base-100 border rounded-2xl p-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              selectedStatus === "Offer"
                ? "border-success ring-2 ring-success/20 bg-success/5"
                : "border-base-content/10 hover:border-success/40"
            }`}
          >
            <div className="stat p-3">
              <div className="stat-figure text-success">
                <CheckCircle2Icon className="size-5 opacity-80" />
              </div>
              <div className="stat-title text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Offer Extended
              </div>
              <div className="stat-value text-xl font-mono text-success">{stats.offers}</div>
              <div className="stat-desc text-[11px] text-base-content/50">Decision stage</div>
            </div>
          </div>

          {/* 5. Rejection */}
          <div
            onClick={() => setSelectedStatus(selectedStatus === "Rejected" ? "ALL" : "Rejected")}
            className={`stats shadow-xs bg-base-100 border rounded-2xl p-1.5 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
              selectedStatus === "Rejected"
                ? "border-error ring-2 ring-error/20 bg-error/5"
                : "border-base-content/10 hover:border-error/40"
            }`}
          >
            <div className="stat p-3">
              <div className="stat-figure text-error">
                <XCircleIcon className="size-5 opacity-80" />
              </div>
              <div className="stat-title text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Rejection
              </div>
              <div className="stat-value text-xl font-mono text-error">{stats.rejections}</div>
              <div className="stat-desc text-[11px] text-base-content/50">Archived</div>
            </div>
          </div>

        </div>

        {/* --- 3. FILTER, SEARCH & SORT CONTROL CONSOLE --- */}
        <div className="bg-base-100 border border-base-content/10 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="text"
                placeholder="Search company, title, location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-sm input-bordered w-full pl-10 rounded-xl bg-base-200/50 focus:bg-base-100 text-xs font-medium"
              />
            </div>
              {/* <h1 className="text-xl md:text-2xl font-black tracking-text-base-content font-mono shrink-0">
                Applications
              </h1> */}
          </div>

          {/* Filter Pills & Sort Selector Container */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            {/* Segmented Filter Pills */}
            <div className="join bg-base-200/60 p-1 rounded-xl border border-base-content/5 overflow-x-auto">
              {[
                { label: "All", value: "ALL" },
                { label: "In Review", value: "Applied" },
                { label: "Rounds", value: "Interviewing" },
                { label: "Offer Extended", value: "Offer" },
                { label: "Rejection", value: "Rejected" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedStatus(tab.value)}
                  className={`join-item btn btn-xs border-0 font-medium ${
                    selectedStatus === tab.value
                      ? "btn-primary shadow-xs"
                      : "btn-ghost text-base-content/70 hover:bg-base-300/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-base-200/60 px-2 py-1 rounded-xl border border-base-content/5">
              <ArrowUpDownIcon className="size-3.5 text-base-content/50 ml-1" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="select select-ghost select-xs text-xs font-semibold focus:bg-transparent"
              >
                <option value="NEWEST">Newest Date</option>
                <option value="OLDEST">Oldest Date</option>
                <option value="COMPANY">Company (A-Z)</option>
              </select>
            </div>
          </div>

        </div>

        {/* --- 4. GRID CONTENT & SKELETON LOADERS --- */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="h-44 rounded-2xl bg-base-100 border border-base-content/10 p-5 animate-pulse flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-5 bg-base-300 rounded-md w-3/4"></div>
                  <div className="h-3.5 bg-base-300 rounded-md w-1/2"></div>
                </div>
                <div className="h-3 bg-base-300 rounded-md w-1/4"></div>
              </div>
            ))}
          </div>
        ) : filteredJobs.length === 0 && !isRateLimited ? (
          <div className="bg-base-100 border border-base-content/10 rounded-2xl p-12 text-center">
            <AppsNotFound />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job._id} job={job} setJobs={setJobs} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Dashboard;