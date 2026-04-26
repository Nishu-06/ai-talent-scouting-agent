import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import CandidateCard from "../components/CandidateCard";
import LoadingState from "../components/LoadingState";
import { useAppContext } from "../context/AppContext";

const recruiterQuestions = [
  "Are you open to new opportunities?",
  "What is your expected salary?",
  "What is your notice period?",
];

function ChatPage() {
  const navigate = useNavigate();
  const { rankedCandidates, assessCandidate, loading, assessingCandidateId, error } = useAppContext();
  const [visibleConversations, setVisibleConversations] = useState({});
  const [revealedScores, setRevealedScores] = useState({});
  const [playbackState, setPlaybackState] = useState({
    candidateId: "",
    pendingSender: "",
  });
  const activePlaybackToken = useRef(0);

  function wait(ms) {
    return new Promise((resolve) => {
      window.setTimeout(resolve, ms);
    });
  }

  async function playConversation(candidateId, conversation) {
    const token = Date.now();
    activePlaybackToken.current = token;

    setVisibleConversations((current) => ({
      ...current,
      [candidateId]: [],
    }));
    setRevealedScores((current) => ({
      ...current,
      [candidateId]: false,
    }));

    for (const message of conversation) {
      if (activePlaybackToken.current !== token) return;

      setPlaybackState({
        candidateId,
        pendingSender: message.sender,
      });

      await wait(message.sender === "recruiter" ? 500 : 1100);

      if (activePlaybackToken.current !== token) return;

      setVisibleConversations((current) => ({
        ...current,
        [candidateId]: [...(current[candidateId] || []), message],
      }));
    }

    if (activePlaybackToken.current !== token) return;

    setPlaybackState({
      candidateId: "",
      pendingSender: "",
    });
    setRevealedScores((current) => ({
      ...current,
      [candidateId]: true,
    }));
  }

  async function handleAssess(candidate) {
    const response = await assessCandidate(candidate, recruiterQuestions);
    await playConversation(candidate.id, response.conversation || []);
  }

  async function handleAssessTopThree() {
    const topCandidates = rankedCandidates.slice(0, 3);
    for (const candidate of topCandidates) {
      await handleAssess(candidate);
    }
    navigate("/dashboard");
  }

  return (
    <section className="space-y-6">
      <div className="section-shell flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.24em] text-brand">Step 3</p>
          <h2 className="mt-2 text-2xl font-semibold text-white">Simulated engagement and interest assessment</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            Recruiter outreach is simulated with three focused questions. The backend converts those responses into an Interest Score.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleAssessTopThree}
            disabled={loading || !rankedCandidates.length}
            className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            Assess Top 3 Candidates
          </button>
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-brand/30 hover:bg-brand/10"
          >
            View Dashboard
          </button>
        </div>
      </div>

      {loading ? <LoadingState label="Generating AI candidate responses and computing interest..." /> : null}
      {!loading && playbackState.candidateId ? (
        <LoadingState label="Playing back the simulated recruiter outreach..." />
      ) : null}
      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <div className="grid gap-6">
        {rankedCandidates.length ? (
          rankedCandidates.map((candidate) => (
            <div key={candidate.id} className="space-y-4">
              <CandidateCard
                candidate={candidate}
                action={() => handleAssess(candidate)}
                actionLabel={
                  assessingCandidateId === candidate.id
                    ? "Generating..."
                    : playbackState.candidateId === candidate.id
                      ? "Simulating..."
                      : "Assess Interest"
                }
                disabled={loading || Boolean(playbackState.candidateId)}
              />

              {candidate.conversation?.length ? (
                <div className="section-shell">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Conversation</p>
                    <div className="flex flex-wrap gap-2">
                      {revealedScores[candidate.id] || !visibleConversations[candidate.id] ? (
                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200">
                          Interest Score: {candidate.interestScore || 0}
                        </span>
                      ) : (
                        <span className="rounded-full border border-warning/20 bg-warning/10 px-3 py-1 text-xs text-warning">
                          Calculating Interest Score...
                        </span>
                      )}
                      <span className="rounded-full border border-brand/20 bg-brand/10 px-3 py-1 text-xs text-brand">
                        Source: {candidate.chatSource === "openai" ? "AI-generated" : "Fallback"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 space-y-3">
                    {(visibleConversations[candidate.id] || candidate.conversation).map((message, index) => (
                      <div
                        key={`${candidate.id}-${index}`}
                        className={`max-w-3xl rounded-2xl px-4 py-3 text-sm leading-6 ${
                          message.sender === "recruiter"
                            ? "bg-brand/10 text-brand ring-1 ring-brand/20"
                            : "bg-white/5 text-slate-100 ring-1 ring-white/10"
                        }`}
                      >
                        <span className="mb-1 block text-xs uppercase tracking-[0.2em] opacity-70">
                          {message.sender}
                        </span>
                        {message.text}
                      </div>
                    ))}
                    {playbackState.candidateId === candidate.id ? (
                      <div className="max-w-3xl rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                        <span className="mb-1 block text-xs uppercase tracking-[0.2em] opacity-70">
                          {playbackState.pendingSender}
                        </span>
                        <div className="flex gap-1">
                          <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.3s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.15s]" />
                          <span className="h-2 w-2 animate-bounce rounded-full bg-brand" />
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <div className="section-shell text-sm text-slate-400">
            No candidates are loaded yet. Start with a JD on the home page.
          </div>
        )}
      </div>
    </section>
  );
}

export default ChatPage;
