import { useEffect } from "react";
import LoadingState from "../components/LoadingState";
import ScoreComparisonChart from "../components/ScoreComparisonChart";
import { useAppContext } from "../context/AppContext";
import { badgeTone, scoreTone } from "../utils/formatters";

function DashboardPage() {
  const { rankedCandidates, parsedJd, refreshResults, loading, error } = useAppContext();

  useEffect(() => {
    if (!rankedCandidates.length) {
      refreshResults().catch(() => {});
    }
  }, []);

  const topCandidate = rankedCandidates[0];

  return (
    <section className="space-y-6">
      <div className="section-shell animate-enter">
        <p className="text-sm uppercase tracking-[0.24em] text-brand">Step 4</p>
        <h2 className="mt-2 text-2xl font-semibold text-white">Ranked shortlist and recruiter summary</h2>
        <p className="mt-2 text-sm leading-6 text-slate-300">
          The final list combines JD fit with demonstrated interest so recruiters can act on strong and willing candidates first.
        </p>
      </div>

      {loading ? <LoadingState label="Loading latest shortlist..." /> : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      {topCandidate ? (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="section-shell animate-enter animate-enter-delay-1 overflow-hidden">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Top Candidate</p>
            <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <h3 className="text-3xl font-semibold text-white">{topCandidate.name}</h3>
                <p className="mt-2 text-sm text-slate-300">
                  {topCandidate.location} · {topCandidate.experience} years
                </p>
                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300">{topCandidate.explanation}</p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${badgeTone(topCandidate.tag)}`}>
                {topCandidate.tag}
              </span>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-emerald-400/10 p-4 ring-1 ring-emerald-300/20">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Match Score</p>
                <p className={`mt-2 text-4xl font-semibold ${scoreTone(topCandidate.matchScore)}`}>
                  {topCandidate.matchScore}
                </p>
              </div>
              <div className="rounded-2xl bg-sky-400/10 p-4 ring-1 ring-sky-300/20">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-100">Interest Score</p>
                <p className={`mt-2 text-4xl font-semibold ${scoreTone(topCandidate.interestScore || 0)}`}>
                  {topCandidate.interestScore || 0}
                </p>
              </div>
              <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Final Score</p>
                <p className={`mt-2 text-4xl font-semibold ${scoreTone(topCandidate.finalScore || 0)}`}>
                  {topCandidate.finalScore || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="section-shell animate-enter animate-enter-delay-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">JD Summary</p>
            {parsedJd ? (
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm text-slate-400">Role</p>
                  <p className="text-lg font-semibold text-white">{parsedJd.role}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Experience</p>
                  <p className="text-lg font-semibold text-white">
                    {parsedJd.experience.min} to {parsedJd.experience.max} years
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Required Skills</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {parsedJd.skills.map((skill) => (
                      <span key={skill} className="rounded-full bg-white/5 px-3 py-1 text-xs text-slate-100 ring-1 ring-white/10">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-slate-400">Run a job description to generate the shortlist summary.</p>
            )}
          </div>
        </div>
      ) : null}

      <ScoreComparisonChart candidates={rankedCandidates} />

      <div className="section-shell animate-enter animate-enter-delay-3 overflow-x-auto">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Ranked Candidates</p>
            <h3 className="mt-2 text-xl font-semibold text-white">Final recruiter-ready list</h3>
          </div>
          <button
            type="button"
            onClick={() => refreshResults()}
            className="button-lift rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-brand/30 hover:bg-brand/10"
          >
            Refresh
          </button>
        </div>

        {rankedCandidates.length ? (
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="text-xs uppercase tracking-[0.22em] text-slate-400">
              <tr>
                <th className="pb-4">Candidate</th>
                <th className="pb-4">Match</th>
                <th className="pb-4">Interest</th>
                <th className="pb-4">Final</th>
                <th className="pb-4">Tag</th>
              </tr>
            </thead>
            <tbody>
              {rankedCandidates.map((candidate, index) => (
                <tr key={candidate.id} className="border-t border-white/10">
                  <td className="py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">
                        #{index + 1} {candidate.name}
                      </span>
                      <span className="text-xs text-slate-400">{candidate.location}</span>
                    </div>
                  </td>
                  <td className={`py-4 font-semibold ${scoreTone(candidate.matchScore)}`}>{candidate.matchScore}</td>
                  <td className={`py-4 font-semibold ${scoreTone(candidate.interestScore || 0)}`}>
                    {candidate.interestScore || 0}
                  </td>
                  <td className={`py-4 font-semibold ${scoreTone(candidate.finalScore || 0)}`}>
                    {candidate.finalScore || 0}
                  </td>
                  <td className="py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${badgeTone(candidate.tag)}`}>
                      {candidate.tag}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-sm text-slate-400">No ranked candidates available yet.</p>
        )}
      </div>
    </section>
  );
}

export default DashboardPage;
