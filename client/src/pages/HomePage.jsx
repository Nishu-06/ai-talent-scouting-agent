import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import LoadingState from "../components/LoadingState";
import StatCard from "../components/StatCard";

const sampleJd = `We are hiring a Senior Full Stack Engineer with strong experience in React, Node.js, MongoDB, AWS, and TypeScript. Candidates should have at least 4 years of experience and be comfortable working remotely with distributed teams across India.`;

function HomePage() {
  const navigate = useNavigate();
  const { parseAndMatch, parsedJd, rankedCandidates, loading, error } = useAppContext();
  const [jobDescription, setJobDescription] = useState(sampleJd);

  async function handleSubmit(event) {
    event.preventDefault();
    await parseAndMatch(jobDescription);
    navigate("/candidates");
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
      <div className="section-shell animate-enter animate-enter-delay-1">
        <div className="mb-6">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-brand">Step 1</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Paste the job description</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <textarea
            value={jobDescription}
            onChange={(event) => setJobDescription(event.target.value)}
            rows={14}
            className="field-focus w-full rounded-3xl border border-white/10 bg-slate-950/70 px-5 py-4 text-sm leading-7 text-slate-100 outline-none"
            placeholder="Paste your job description here..."
          />

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={loading}
              className="button-lift rounded-full bg-brand px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
            >
              Parse JD and Discover Talent
            </button>
            <button
              type="button"
              onClick={() => setJobDescription(sampleJd)}
              className="button-lift rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-brand/30 hover:bg-brand/10"
            >
              Load Sample JD
            </button>
          </div>
        </form>

        {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
      </div>

      <div className="space-y-6">
        {loading ? <LoadingState label="Parsing requirements and scoring the candidate pool..." /> : null}

        <div className="section-shell animate-enter animate-enter-delay-2">
          <p className="text-sm uppercase tracking-[0.24em] text-brand">Snapshot</p>
          <h3 className="mt-2 text-xl font-semibold text-white">What the recruiter gets</h3>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <StatCard label="Candidate Pool" value="15" hint="Seeded profiles across modern stacks" />
            <StatCard
              label="Scoring Model"
              value="2D"
              hint="Match Score + Interest Score with explainability"
            />
            <StatCard
              label="Top Output"
              value={rankedCandidates.length || "0"}
              hint="Shortlisted candidates ready for review"
            />
          </div>
        </div>

        <div className="section-shell animate-enter animate-enter-delay-3">
          <p className="text-sm uppercase tracking-[0.24em] text-brand">Parsed Preview</p>
          {parsedJd ? (
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Role</p>
                <p className="mt-1 text-lg font-medium text-white">{parsedJd.role}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Skills</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {parsedJd.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-slate-300">
                Experience: {parsedJd.experience.min} to {parsedJd.experience.max} years
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm text-slate-400">The extracted JD structure will appear here after parsing.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
