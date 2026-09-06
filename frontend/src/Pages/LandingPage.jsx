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
    <div className="relative isolate min-h-screen overflow-hidden bg-base-200/50 text-base-content antialiased flex flex-col justify-between">
      {/* Theme-aware ambient light */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute left-1/2 top-[-18rem] h-[38rem] w-[48rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="absolute right-[-12rem] top-[24rem] h-[28rem] w-[28rem] rounded-full bg-secondary/15 blur-3xl"></div>
        <div className="absolute bottom-[-14rem] left-[-10rem] h-[30rem] w-[30rem] rounded-full bg-accent/10 blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[size:64px_64px] text-base-content/[0.025] [mask-image:linear-gradient(to_bottom,black,transparent_72%)]"></div>
      </div>

      {/* 1. Public Header */}
      <header className="sticky top-0 z-30 border-b border-base-content/10 bg-base-100/65 shadow-[0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
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
            <Link to="/signup" className="btn btn-primary btn-sm gap-2 border-white/10 bg-gradient-to-b from-primary to-primary/85 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/30">
              <span>Get Started</span>
              <ArrowRightIcon className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_-12px_currentColor] backdrop-blur-md">
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
            <Link to="/signup" className="btn btn-primary btn-md w-full sm:w-auto gap-2 border-white/10 bg-gradient-to-b from-primary to-primary/85 shadow-xl shadow-primary/25 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-primary/35">
              <span>Start Tracking Free</span>
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>

        {/* 3. Interactive Mock Preview Window */}
        <div className="max-w-5xl mx-auto">
          <div className="mockup-window relative overflow-hidden rounded-3xl border border-white/20 bg-base-300/45 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.55),0_0_60px_-24px_hsl(var(--p))] ring-1 ring-base-content/10 backdrop-blur-xl before:pointer-events-none before:absolute before:inset-x-8 before:top-0 before:z-20 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/70 before:to-transparent">
            <div className="relative space-y-6 bg-base-100/75 p-6 backdrop-blur-xl md:p-8">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/10 to-transparent" aria-hidden="true"></div>
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
                <div className="relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-200/55 p-4 space-y-3 shadow-sm ring-1 ring-white/5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/35">
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
                <div className="relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-200/55 p-4 space-y-3 shadow-sm ring-1 ring-white/5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/35">
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
                <div className="relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-200/55 p-4 space-y-3 shadow-sm ring-1 ring-white/5 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/35">
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
          <div className="group relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/75 p-6 space-y-3 shadow-lg shadow-base-content/5 ring-1 ring-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent">
            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <LayersIcon className="size-5" />
            </div>
            <h3 className="font-bold text-base">Stage Progression</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Categorize applications across In Review, Interviewing rounds, Offers, and Archives.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/75 p-6 space-y-3 shadow-lg shadow-base-content/5 ring-1 ring-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-secondary/25 hover:shadow-xl hover:shadow-secondary/10 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent">
            <div className="size-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <TrendingUpIcon className="size-5" />
            </div>
            <h3 className="font-bold text-base">Live Analytics</h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Monitor key metrics and conversion rates as you progress through each interview stage.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/75 p-6 space-y-3 shadow-lg shadow-base-content/5 ring-1 ring-white/5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-accent/25 hover:shadow-xl hover:shadow-accent/10 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/50 before:to-transparent">
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
