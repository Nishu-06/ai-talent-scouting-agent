import { badgeTone, scoreTone } from "../utils/formatters";

function CandidateCard({ candidate, action, actionLabel, disabled }) {
  return (
    <article className="section-shell animate-enter relative overflow-hidden">
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-brand/10 blur-2xl" />
      <div className="relative flex flex-col gap-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white">{candidate.name}</h3>
            <p className="mt-1 text-sm text-slate-300">
              {candidate.location} · {candidate.experience} years experience
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(candidate.skills || []).slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200 transition duration-300 hover:border-brand/25 hover:bg-brand/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center transition duration-300 hover:border-brand/25 hover:bg-black/30">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Match</p>
              <p className={`mt-1 text-2xl font-semibold ${scoreTone(candidate.matchScore)}`}>
                {candidate.matchScore}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center transition duration-300 hover:border-brand/25 hover:bg-black/30">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Interest</p>
              <p className={`mt-1 text-2xl font-semibold ${scoreTone(candidate.interestScore || 0)}`}>
                {candidate.interestScore || 0}
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-center transition duration-300 hover:border-brand/25 hover:bg-black/30">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-400">Final</p>
              <p className={`mt-1 text-2xl font-semibold ${scoreTone(candidate.finalScore || candidate.matchScore)}`}>
                {candidate.finalScore || candidate.matchScore}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ring-1 ${badgeTone(candidate.tag)}`}>
            {candidate.tag}
          </span>
          <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">
            {candidate.status === "open" ? "Actively Open" : "Passive Candidate"}
          </span>
        </div>

        <p className="text-sm leading-6 text-slate-300">{candidate.explanation}</p>

        {action ? (
          <div>
            <button
              type="button"
              onClick={action}
              disabled={disabled}
              className="button-lift rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLabel}
            </button>
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default CandidateCard;
