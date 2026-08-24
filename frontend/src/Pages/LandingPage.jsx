import React from "react";
import { Link } from "react-router";
import {
  BriefcaseIcon,
  CheckCircle2Icon,
  ClockIcon,
  LayersIcon,
  TrendingUpIcon,
  ScrollText,
  SparklesIcon,
  ArrowRightIcon,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base-200/50 text-base-content antialiased flex flex-col justify-between">
      {/* 1. Public Header */}
      <header className="border-b border-base-content/10 bg-base-100/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BriefcaseIcon className="size-6 text-primary" />
            <span className="text-xl font-bold font-mono text-primary">
              Tracklicant
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn btn-ghost btn-sm">
              Sign In
            </Link>
            <Link to="/signup" className="btn btn-primary btn-sm gap-2 shadow-xs">
              <span>Get Started</span>
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold uppercase tracking-wider">
            <SparklesIcon className="size-3.5" />
            Streamlined Job Search
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight font-mono text-base-content">
            Master your job search pipeline in one place.
          </h1>

          <p className="text-base sm:text-lg text-base-content/70 max-w-2xl mx-auto leading-relaxed">
            Track applications across companies, monitor interview rounds, and
            analyze your application success rates with zero clutter.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link to="/signup" className="btn btn-primary btn-md w-full sm:w-auto gap-2">
              <span>Start Tracking Free</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>

        {/* 3. Interactive Mock Preview Window */}
        <div className="max-w-5xl mx-auto">
          <div className="mockup-window border border-base-content/15 bg-base-300/40 shadow-2xl rounded-3xl overflow-hidden">
            <div className="bg-base-100 p-6 md:p-8 space-y-6">
              {/* Mock Header Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-base-content/10">
                <div>
                  <div className="h-5 w-36 bg-base-content/20 rounded-md mb-1 font-mono font-bold text-xs flex items-center px-1 text-base-content/70">
                    PIPELINE PREVIEW
                  </div>
                  <div className="h-3 w-48 bg-base-content/10 rounded"></div>
                </div>
                <div className="flex gap-2">
                  <span className="badge badge-primary badge-sm">4 Active</span>
                  <span className="badge badge-success badge-sm">1 Offer</span>
                </div>
              </div>

              {/* Mock Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Mock Card 1 */}
                <div className="p-4 rounded-2xl border border-base-content/10 bg-base-200/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">Google</h4>
                      <p className="text-xs text-base-content/60">Software Engineer Intern</p>
                    </div>
                    <span className="badge badge-xs badge-warning gap-1 p-2">
                      <LayersIcon className="size-3" /> Interviewing
                    </span>
                  </div>
                  <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                    <div className="h-full bg-warning w-3/4 rounded-full"></div>
                  </div>
                  <p className="text-[11px] text-base-content/50">Round 2: Technical Screen</p>
                </div>

                {/* Mock Card 2 */}
                <div className="p-4 rounded-2xl border border-base-content/10 bg-base-200/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">Microsoft</h4>
                      <p className="text-xs text-base-content/60">Frontend Engineer</p>
                    </div>
                    <span className="badge badge-xs badge-success gap-1 p-2">
                      <CheckCircle2Icon className="size-3" /> Offer
                    </span>
                  </div>
                  <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                    <div className="h-full bg-success w-full rounded-full"></div>
                  </div>
                  <p className="text-[11px] text-base-content/50">Offer extended • Decision pending</p>
                </div>

                {/* Mock Card 3 */}
                <div className="p-4 rounded-2xl border border-base-content/10 bg-base-200/50 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-sm">Stripe</h4>
                      <p className="text-xs text-base-content/60">Fullstack Developer</p>
                    </div>
                    <span className="badge badge-xs badge-info gap-1 p-2">
                      <ClockIcon className="size-3" /> Applied
                    </span>
                  </div>
                  <div className="h-2 w-full bg-base-300 rounded-full overflow-hidden">
                    <div className="h-full bg-info w-1/4 rounded-full"></div>
                  </div>
                  <p className="text-[11px] text-base-content/50">Submitted 3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
          <div className="p-6 rounded-2xl border border-base-content/10 bg-base-100 space-y-3">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <LayersIcon className="size-5" />
            </div>
            <h3 className="font-bold text-base">Stage Progression</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Categorize applications across In Review, Interviewing rounds, Offers, and Archives.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-base-content/10 bg-base-100 space-y-3">
            <div className="size-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <TrendingUpIcon className="size-5" />
            </div>
            <h3 className="font-bold text-base">Live Analytics</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Monitor key metrics and conversion rates as you progress through each interview stage.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-base-content/10 bg-base-100 space-y-3">
            <div className="size-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
              <ScrollText className="size-5" />
            </div>
            <h3 className="font-bold text-base">Search for new Jobs</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Discover and search through software internship listings across all companies, with direct links to apply instantly.
            </p>
          </div>
        </div>
      </main>

      {/* 5. Minimal Footer */}
      <footer className="border-t border-base-content/10 py-6 text-center text-xs text-base-content/50">
        © {new Date().getFullYear()} Tracklicant. All rights reserved.
      </footer>
    </div>
  );
};

export default LandingPage;