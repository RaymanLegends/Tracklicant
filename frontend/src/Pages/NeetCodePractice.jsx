import { useState, useEffect } from "react";
import {
  Code2Icon,
  SparklesIcon,
  CheckCircle2Icon,
  RotateCcwIcon,
  SearchIcon,
  ExternalLinkIcon,
  DicesIcon,
  LayersIcon,
  MinusIcon,
  PlusIcon,
  ArrowUpDownIcon,
} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import api from "../lib/axios.js";
import toast from "react-hot-toast";

const PracticeCounter = ({ prob, isUpdating, onChange }) => {
  const count = prob.timesPracticed || 0;

  return (
    <div className="join items-center rounded-xl border border-base-content/10 bg-base-200/50" aria-label={`Practice completions for ${prob.title}`}>
      <button
        type="button"
        onClick={() => onChange(prob, "decrement")}
        disabled={isUpdating || count === 0}
        className="btn btn-ghost btn-sm join-item px-2.5"
        aria-label={`Remove one completion for ${prob.title}`}
      >
        <MinusIcon className="size-4" />
      </button>
      <span className="min-w-10 px-2 text-center font-mono text-sm font-bold" aria-live="polite">
        {count}
      </span>
      <button
        type="button"
        onClick={() => onChange(prob, "increment")}
        disabled={isUpdating}
        className="btn btn-primary btn-sm join-item px-2.5"
        aria-label={`Log one completion for ${prob.title}`}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

const NeetCodePractice = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Roulette Roller State
  const [rolledProblem, setRolledProblem] = useState(null);
  const [rollerDifficulty, setRollerDifficulty] = useState("");
  const [isRolling, setIsRolling] = useState(false);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("CATEGORY");
  const [updatingProblemId, setUpdatingProblemId] = useState(null);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await api.get("/prep/all");
        setProblems(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching prep data:", error);
        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else {
          toast.error("Failed to load prep list");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, []);

  // Standard JavaScript calculations (calculated directly on render)
  const total = problems.length;
  const completed = problems.filter((p) => p.completed).length;
  const easyDone = problems.filter((p) => p.difficulty === "Easy" && p.completed).length;
  const medDone = problems.filter((p) => p.difficulty === "Medium" && p.completed).length;
  const hardDone = problems.filter((p) => p.difficulty === "Hard" && p.completed).length;

  // Category list
  const categories = ["ALL", ...new Set(problems.map((p) => p.category))];

  // Filtered problems list
  const filteredProblems = problems.filter((p) => {
    const matchesSearch =
      (p.title?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (p.category?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    const matchesDiff =
      selectedDifficulty === "ALL" ||
      (selectedDifficulty === "SOLVED" && p.completed) ||
      (selectedDifficulty === "UNSOLVED" && !p.completed) ||
      p.difficulty === selectedDifficulty;

    const matchesCat =
      selectedCategory === "ALL" || p.category === selectedCategory;

    return matchesSearch && matchesDiff && matchesCat;
  }).sort((a, b) => {
    if (sortBy === "TITLE") return a.title.localeCompare(b.title);
    if (sortBy === "DIFFICULTY") {
      const rank = { Easy: 0, Medium: 1, Hard: 2 };
      return rank[a.difficulty] - rank[b.difficulty] || a.title.localeCompare(b.title);
    }
    if (sortBy === "PRACTICED") {
      return (b.timesPracticed || 0) - (a.timesPracticed || 0) || a.title.localeCompare(b.title);
    }
    return a.category.localeCompare(b.category) || a.title.localeCompare(b.title);
  });

  // Roll an Unsolved Problem
  const handleRollNew = async () => {
    try {
      setIsRolling(true);
      const query = rollerDifficulty ? `?difficulty=${rollerDifficulty}` : "";
      const res = await api.get(`/prep/random-new${query}`);
      setRolledProblem(res.data);
      toast.success("Rolled a new challenge!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("No unsolved problems found with that filter!");
      } else {
        toast.error("Failed to roll problem");
      }
    } finally {
      setIsRolling(false);
    }
  };

  // Roll a Completed Problem for Review
  const handleRollReview = async () => {
    try {
      setIsRolling(true);
      const res = await api.get("/prep/random-review");
      setRolledProblem(res.data);
      toast.success("Rolled a review question!");
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("No completed problems to review yet!");
      } else {
        toast.error("Failed to roll review problem");
      }
    } finally {
      setIsRolling(false);
    }
  };

  // Add or remove a completed practice attempt.
  const handlePracticeCount = async (prob, action) => {
    const targetId = prob.problemId || prob.id;

    if (!targetId) {
      console.error("No valid problemId or id found on problem:", prob);
      toast.error("Problem identifier missing");
      return;
    }

    try {
      setUpdatingProblemId(targetId);
      const res = await api.post("/prep/log", {
        problemId: targetId,
        title: prob.title,
        difficulty: prob.difficulty,
        category: prob.category,
        leetcodeUrl: prob.leetcodeUrl,
        action,
      });

      const updated = res.data;

      // Update local state matching against both keys
      setProblems((prev) =>
        prev.map((item) =>
          (item.problemId || item.id) === targetId
            ? {
                ...item,
                completed: updated.completed,
                timesPracticed: updated.timesPracticed,
                lastPracticedAt: updated.lastPracticedAt,
              }
            : item
        )
      );

      if (rolledProblem && (rolledProblem.problemId || rolledProblem.id) === targetId) {
        setRolledProblem((prev) => ({ ...prev, ...updated }));
      }

      toast.success(action === "increment" ? "Practice completion logged" : "Practice completion removed");
    } catch (error) {
      console.error("Error updating problem log:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setUpdatingProblemId(null);
    }
  };

  return (
    <div className="min-h-screen bg-base-200/40 text-base-content antialiased">
      <Navbar />

      {isRateLimited && <RateLimitedUI />}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* --- 1. HEADER & METRICS --- */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-base-content/10 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-base-content font-mono flex items-center gap-2">
              <Code2Icon className="size-8 text-primary" />
              Technical Prep
            </h1>
            <p className="text-sm text-base-content/60 mt-1">
              NeetCode 150 practice tracker with spaced repetition roulette.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge badge-lg badge-primary badge-outline font-mono font-bold">
              {completed} / {total} Solved
            </span>
          </div>
        </div>

        {/* --- 2. KPI METRICS BAR --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="stats shadow-xs bg-base-100 border border-base-content/10 rounded-2xl p-1.5">
            <div className="stat p-3">
              <div className="stat-figure text-primary">
                <CheckCircle2Icon className="size-5 opacity-80" />
              </div>
              <div className="stat-title text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Completion Rate
              </div>
              <div className="stat-value text-xl font-mono">
                {total > 0 ? Math.round((completed / total) * 100) : 0}%
              </div>
              <div className="stat-desc text-[11px] text-base-content/50">{completed} total solved</div>
            </div>
          </div>

          <div className="stats shadow-xs bg-base-100 border border-base-content/10 rounded-2xl p-1.5">
            <div className="stat p-3">
              <div className="stat-figure text-success">
                <SparklesIcon className="size-5 opacity-80" />
              </div>
              <div className="stat-title text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Easy
              </div>
              <div className="stat-value text-xl font-mono text-success">{easyDone}</div>
              <div className="stat-desc text-[11px] text-base-content/50">Solved</div>
            </div>
          </div>

          <div className="stats shadow-xs bg-base-100 border border-base-content/10 rounded-2xl p-1.5">
            <div className="stat p-3">
              <div className="stat-figure text-warning">
                <LayersIcon className="size-5 opacity-80" />
              </div>
              <div className="stat-title text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Medium
              </div>
              <div className="stat-value text-xl font-mono text-warning">{medDone}</div>
              <div className="stat-desc text-[11px] text-base-content/50">Solved</div>
            </div>
          </div>

          <div className="stats shadow-xs bg-base-100 border border-base-content/10 rounded-2xl p-1.5">
            <div className="stat p-3">
              <div className="stat-figure text-error">
                <RotateCcwIcon className="size-5 opacity-80" />
              </div>
              <div className="stat-title text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                Hard
              </div>
              <div className="stat-value text-xl font-mono text-error">{hardDone}</div>
              <div className="stat-desc text-[11px] text-base-content/50">Solved</div>
            </div>
          </div>
        </div>

        {/* --- 3. ROULETTE PRACTICE HERO SECTION --- */}
        <div className="bg-base-100 border border-base-content/10 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold font-mono text-base-content flex items-center gap-2">
                <DicesIcon className="size-5 text-primary" />
                Practice Roulette
              </h2>
              <p className="text-xs text-base-content/60">
                Roll an unsolved problem to learn, or roll a completed problem for spaced review.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <select
                value={rollerDifficulty}
                onChange={(e) => setRollerDifficulty(e.target.value)}
                className="select select-bordered select-sm rounded-xl text-xs font-semibold"
              >
                <option value="">Any Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>

              <button
                onClick={handleRollNew}
                disabled={isRolling}
                className="btn btn-sm btn-primary rounded-xl font-semibold text-xs"
              >
                🎲 Roll Unsolved
              </button>

              <button
                onClick={handleRollReview}
                disabled={isRolling}
                className="btn btn-sm btn-outline btn-secondary rounded-xl font-semibold text-xs"
              >
                🔁 Review Solved
              </button>
            </div>
          </div>

          {rolledProblem && (
            <div className="mt-4 p-5 rounded-xl bg-base-200/50 border border-base-content/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="badge badge-sm badge-ghost font-mono text-[10px]">
                    {rolledProblem.category}
                  </span>
                  <span
                    className={`badge badge-sm font-bold text-[10px] ${
                      rolledProblem.difficulty === "Easy"
                        ? "badge-success badge-outline"
                        : rolledProblem.difficulty === "Medium"
                        ? "badge-warning badge-outline"
                        : "badge-error badge-outline"
                    }`}
                  >
                    {rolledProblem.difficulty}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-base-content">{rolledProblem.title}</h3>
                <div className="flex items-center gap-3 text-xs text-base-content/60">
                  <a
                    href={rolledProblem.leetcodeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="link link-primary inline-flex items-center gap-1 font-semibold"
                  >
                    Open on LeetCode <ExternalLinkIcon className="size-3" />
                  </a>
                  <span>•</span>
                  <span>Reps: {rolledProblem.timesPracticed || 0}</span>
                </div>
              </div>

              <PracticeCounter
                prob={rolledProblem}
                isUpdating={updatingProblemId === (rolledProblem.problemId || rolledProblem.id)}
                onChange={handlePracticeCount}
              />
            </div>
          )}
        </div>

        {/* --- 4. FILTER & SEARCH CONTROL CONSOLE --- */}
        <div className="bg-base-100 border border-base-content/10 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
            <input
              type="text"
              placeholder="Search problem or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input input-sm input-bordered w-full pl-10 rounded-xl bg-base-200/50 focus:bg-base-100 text-xs font-medium"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between md:justify-end gap-3 w-full md:w-auto">
            <label className="input input-bordered input-xs rounded-xl flex items-center gap-2">
              <ArrowUpDownIcon className="size-3.5 text-base-content/50" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent text-xs font-semibold outline-none"
                aria-label="Sort problems"
              >
                <option value="CATEGORY">Category</option>
                <option value="TITLE">Problem name</option>
                <option value="DIFFICULTY">Difficulty</option>
                <option value="PRACTICED">Most practiced</option>
              </select>
            </label>

            {/* Difficulty Tabs */}
            <div className="join bg-base-200/60 p-1 rounded-xl border border-base-content/5 overflow-x-auto">
              {[
                { label: "All", value: "ALL" },
                { label: "Easy", value: "Easy" },
                { label: "Medium", value: "Medium" },
                { label: "Hard", value: "Hard" },
                { label: "Unsolved", value: "UNSOLVED" },
                { label: "Solved", value: "SOLVED" },
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setSelectedDifficulty(tab.value)}
                  className={`join-item btn btn-xs border-0 font-medium ${
                    selectedDifficulty === tab.value
                      ? "btn-primary shadow-xs"
                      : "btn-ghost text-base-content/70 hover:bg-base-300/60"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Problem categories">
          {categories.map((cat) => {
            const categoryCount = cat === "ALL" ? problems.length : problems.filter((p) => p.category === cat).length;
            return (
              <button
                type="button"
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`btn btn-sm rounded-xl whitespace-nowrap ${selectedCategory === cat ? "btn-primary" : "btn-ghost bg-base-100 border border-base-content/10"}`}
              >
                {cat === "ALL" ? "All categories" : cat}
                <span className="badge badge-sm badge-ghost">{categoryCount}</span>
              </button>
            );
          })}
        </div>

        {/* --- 5. CHECKLIST VIEW --- */}
        <div className="bg-base-100 border border-base-content/10 rounded-2xl overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-12 text-center text-base-content/40 font-mono text-sm">
              Loading problems...
            </div>
          ) : filteredProblems.length === 0 ? (
            <div className="p-12 text-center text-base-content/50 font-mono text-sm">
              No matching problems found.
            </div>
          ) : (
            <div className="divide-y divide-base-content/5">
              {filteredProblems.map((prob) => (
                <div
                  key={prob.problemId || prob.id}
                  className="p-4 flex items-center justify-between hover:bg-base-200/40 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <PracticeCounter
                      prob={prob}
                      isUpdating={updatingProblemId === (prob.problemId || prob.id)}
                      onChange={handlePracticeCount}
                    />
                    <div>
                      <a
                        href={prob.leetcodeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`text-sm font-semibold hover:underline inline-flex items-center gap-1.5 ${
                          prob.completed ? "line-through text-base-content/40" : "text-base-content"
                        }`}
                      >
                        {prob.title}
                        <ExternalLinkIcon className="size-3 opacity-40 hover:opacity-100" />
                      </a>
                      <div className="flex items-center gap-2 text-[11px] text-base-content/50 mt-0.5">
                        <span>{prob.category}</span>
                        <span>•</span>
                        <span>{prob.completed ? "Solved" : "Not solved yet"}</span>
                      </div>
                    </div>
                  </div>

                  <span
                    className={`badge badge-sm font-bold text-[10px] ${
                      prob.difficulty === "Easy"
                        ? "badge-success badge-outline"
                        : prob.difficulty === "Medium"
                        ? "badge-warning badge-outline"
                        : "badge-error badge-outline"
                    }`}
                  >
                    {prob.difficulty}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default NeetCodePractice;
