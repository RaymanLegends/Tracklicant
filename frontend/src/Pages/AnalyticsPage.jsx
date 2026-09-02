import React, { useMemo, useState, useEffect } from 'react';
import { 
  BarChart3Icon, 
  TrendingUpIcon, 
  BriefcaseIcon, 
  AwardIcon, 
  CheckCircle2Icon, 
  XCircleIcon,
  ClockIcon,
  CalendarIcon
} from 'lucide-react';
import { Link } from 'react-router';
import Navbar from '../components/Navbar';
import api from '../lib/axios';
import toast from 'react-hot-toast';

export default function AnalyticsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs(res.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);
  // Compute analytics dynamically
  const stats = useMemo(() => {
    const total = jobs.length;
    if (total === 0) {
      return {
        total: 0,
        applied: 0,
        interviewing: 0,
        offers: 0,
        rejected: 0,
        interviewRate: '0.0',
        offerRate: '0.0',
        activeCount: 0,
        last30Days: 0,
        thisWeek: 0,
        lastWeek: 0,
        weekChange: 0,
      };
    }

    const counts = {
      applied: 0,
      interviewing: 0,
      offers: 0,
      rejected: 0,
      last30Days: 0,
      thisWeek: 0,
      lastWeek: 0,
    };

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    jobs.forEach((job) => {
      const status = job.appStatus || 'Applied';
      if (status === 'Interviewing') counts.interviewing += 1;
      else if (status === 'Offer') counts.offers += 1;
      else if (status === 'Rejected') counts.rejected += 1;
      else counts.applied += 1;

      // Track recent velocity
      if (job.createdAt) {
        const jobDate = new Date(job.createdAt);
        if (jobDate >= thirtyDaysAgo) {
          counts.last30Days += 1;
        }
        if (jobDate >= sevenDaysAgo) {
          counts.thisWeek += 1;
        }
        if (jobDate >= fourteenDaysAgo && jobDate < sevenDaysAgo) {
          counts.lastWeek += 1;
        }
      }
    });

    // Calculate week-over-week change
    const weekChange = counts.lastWeek === 0 
      ? (counts.thisWeek > 0 ? 100 : 0)
      : (((counts.thisWeek - counts.lastWeek) / counts.lastWeek) * 100).toFixed(1);

    // Interview rate = anyone who reached Interviewing OR Offer / Total
    const reachedInterviews = counts.interviewing + counts.offers;
    const interviewRate = ((reachedInterviews / total) * 100).toFixed(1);
    const offerRate = ((counts.offers / total) * 100).toFixed(1);
    const activeCount = counts.applied + counts.interviewing;

    return {
      total,
      applied: counts.applied,
      interviewing: counts.interviewing,
      offers: counts.offers,
      rejected: counts.rejected,
      interviewRate,
      offerRate,
      activeCount,
      last30Days: counts.last30Days,
      thisWeek: counts.thisWeek,
      lastWeek: counts.lastWeek,
      weekChange,
    };
  }, [jobs]);

  if (jobs.length === 0) {
    return (
      <div className="container max-w-5xl mx-auto px-4 py-12 text-center">
        <BarChart3Icon className="size-16 mx-auto text-base-content/20 mb-4" />
        <h2 className="text-2xl font-bold">No Data Available Yet</h2>
        <p className="text-base-content/60 mt-2 mb-6">
          Start logging job applications to view real-time recruitment KPIs and pipeline metrics.
        </p>
        <Link to="/create" className="btn btn-primary">
          Log Your First Job
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Navbar/>
      <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-base-content flex items-center gap-2">
            <BarChart3Icon className="size-8 text-primary" />
            Recruitment Analytics & KPIs
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Performance metrics across your active recruitment pipeline and historical submissions.
          </p>
        </div>

        {/* Top Level Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {/* Total Applications */}
          <div className="stat flex flex-col items-center text-center bg-base-100 border border-base-content/10 rounded-2xl shadow-sm px-3 py-4">
            <div className="stat-figure mb-2 flex w-full items-center justify-center text-primary">
              <BriefcaseIcon className="size-8 opacity-80" />
            </div>
            <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Total Logged
            </div>
            <div className="stat-value text-3xl text-base-content">{stats.total}</div>
            <div className="stat-desc text-xs text-base-content/50 mt-1 flex items-center justify-center gap-1">
              <CalendarIcon className="size-3" /> {stats.last30Days} in last 30 days
            </div>
          </div>

          {/* Interview Rate */}
          <div className="stat flex flex-col items-center text-center bg-base-100 border border-base-content/10 rounded-2xl shadow-sm px-3 py-4">
            <div className="stat-figure mb-2 flex w-full items-center justify-center text-amber-500">
              <TrendingUpIcon className="size-8 opacity-80" />
            </div>
            <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Interview Rate
            </div>
            <div className="stat-value text-3xl text-amber-600">{stats.interviewRate}%</div>
            <div className="stat-desc text-xs text-base-content/50 mt-1">
              {stats.interviewing + stats.offers} moved past initial screen
            </div>
          </div>

          {/* Offer Conversion */}
          <div className="stat flex flex-col items-center text-center bg-base-100 border border-base-content/10 rounded-2xl shadow-sm px-3 py-4">
            <div className="stat-figure mb-2 flex w-full items-center justify-center text-emerald-500">
              <AwardIcon className="size-8 opacity-80" />
            </div>
            <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Offer Rate
            </div>
            <div className="stat-value text-3xl text-emerald-600">{stats.offerRate}%</div>
            <div className="stat-desc text-xs text-base-content/50 mt-1">
              {stats.offers} total offers received
            </div>
          </div>

          {/* Active Pipeline */}
          <div className="stat flex flex-col items-center text-center bg-base-100 border border-base-content/10 rounded-2xl shadow-sm px-3 py-4">
            <div className="stat-figure mb-2 flex w-full items-center justify-center text-sky-500">
              <ClockIcon className="size-8 opacity-80" />
            </div>
            <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Active Pipeline
            </div>
            <div className="stat-value text-3xl text-sky-600">{stats.activeCount}</div>
            <div className="stat-desc text-xs text-base-content/50 mt-1">
              Pending response or in-progress
            </div>
          </div>

          {/* Week-over-Week Trend */}
          <div className="stat flex flex-col items-center text-center bg-base-100 border border-base-content/10 rounded-2xl shadow-sm px-3 py-4">
            <div className={`stat-figure mb-2 flex w-full items-center justify-center ${stats.weekChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              <TrendingUpIcon className="size-8 opacity-80" />
            </div>
            <div className="stat-title text-xs font-semibold uppercase tracking-wider text-base-content/60">
              Week-over-Week
            </div>
            <div className={`stat-value text-3xl ${stats.weekChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.weekChange > 0 ? '+' : ''}{stats.weekChange}%
            </div>
            <div className="stat-desc text-xs text-base-content/50 mt-1">
              This week: {stats.thisWeek} apps, Last week: {stats.lastWeek}
            </div>
          </div>
        </div>

        {/* Pipeline Funnel Breakdown */}
        <div className="card bg-base-100 border border-base-content/10 shadow-sm p-6 rounded-2xl">
          <h2 className="text-lg font-bold text-base-content mb-1">Application Funnel Breakdown</h2>
          <p className="text-xs text-base-content/60 mb-6">
            Volume and distribution of candidates across each recruitment stage.
          </p>

          <div className="space-y-5">
            {/* Applied */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-sky-600">
                  <span className="size-2 rounded-full bg-sky-500"></span> Applied / Awaiting Response
                </span>
                <span className="text-base-content/70">
                  {stats.applied} ({((stats.applied / stats.total) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-sky-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.applied / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Interviewing */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-amber-600">
                  <span className="size-2 rounded-full bg-amber-500"></span> In Interview Loops
                </span>
                <span className="text-base-content/70">
                  {stats.interviewing} ({((stats.interviewing / stats.total) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.interviewing / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Offer */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-emerald-600">
                  <span className="size-2 rounded-full bg-emerald-500"></span> Offers Received
                </span>
                <span className="text-base-content/70">
                  {stats.offers} ({((stats.offers / stats.total) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.offers / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Rejected */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="flex items-center gap-1.5 text-rose-600">
                  <span className="size-2 rounded-full bg-rose-500"></span> Rejections
                </span>
                <span className="text-base-content/70">
                  {stats.rejected} ({((stats.rejected / stats.total) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-rose-500 h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Insight Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-600 rounded-xl">
              <CheckCircle2Icon className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-base-content">Interview Conversion Benchmark</h3>
              <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
                Industry averages for tech internship callbacks sit between 3% and 10%. Your callback rate is currently{' '}
                <strong className="text-base-content">{stats.interviewRate}%</strong>.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-start gap-4">
            <div className="p-3 bg-sky-500/10 text-sky-600 rounded-xl">
              <TrendingUpIcon className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-base-content">Application Velocity</h3>
              <p className="text-xs text-base-content/60 mt-1 leading-relaxed">
                You have submitted <strong className="text-base-content">{stats.last30Days}</strong> applications over the last 30 days. Consistent output directly drives pipeline momentum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}