import { Link } from "react-router-dom";
import CandidateCard from "../components/CandidateCard";
import LoadingState from "../components/LoadingState";
import { useAppContext } from "../context/AppContext";

function CandidatesPage() {
  const { parsedJd, rankedCandidates, loading, error } = useAppContext();

  return (
    <section className="space-y-6">
      <div className="section-shell flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-brand">Step 2</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Candidate discovery and explainable matching</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Candidates are ranked by skill overlap and experience fit. Each card explains why the profile matched and what is missing.
          </p>
        </div>
        <Link
          to="/chat"
          className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-brand"
        >
          Continue to interest assessment
        </Link>
      </div>

      {loading ? <LoadingState label="Refreshing shortlist..." /> : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      {parsedJd ? (
        <div className="section-shell">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Target Role</p>
          <div className="mt-2 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <h3 className="text-xl font-semibold text-white">{parsedJd.role}</h3>
            <p className="text-sm text-slate-300">
              Experience target: {parsedJd.experience.min} to {parsedJd.experience.max} years
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5">
        {rankedCandidates.length ? (
          rankedCandidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)
        ) : (
          <div className="section-shell text-sm text-slate-400">
            No candidates yet. Start from the home page and run a JD through the engine.
          </div>
        )}
      </div>
    </section>
  );
}

export default CandidatesPage;

