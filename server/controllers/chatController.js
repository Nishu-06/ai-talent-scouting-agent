import { generateCandidateAnswers } from "../services/openaiService.js";
import { calculateFinalScore, calculateInterestScoreFromAnswers, deriveCandidateTag } from "../services/scoringService.js";
import { getLatestResults, saveLatestResults } from "../services/resultsStore.js";

export async function chatController(req, res) {
  const { candidateId, candidate: candidatePayload, questions } = req.body;

  const recruiterQuestions = Array.isArray(questions) && questions.length === 3
    ? questions
    : [
        "Are you open to new opportunities?",
        "What is your expected salary?",
        "What is your notice period?",
      ];

  if (!candidateId && !candidatePayload) {
    return res.status(400).json({ message: "candidateId or candidate data is required." });
  }

  const latestResults = await getLatestResults();
  const candidates = latestResults.rankedCandidates || [];
  const candidate =
    candidates.find((item) => item.id === candidateId) ||
    candidatePayload;

  if (!candidate) {
    return res.status(404).json({ message: "Candidate not found in current shortlist." });
  }

  const simulation = await generateCandidateAnswers(candidate, recruiterQuestions);
  const conversation = recruiterQuestions.flatMap((question, index) => [
    { sender: "recruiter", text: question },
    { sender: "candidate", text: simulation.answers[index] || "" },
  ]);
  const interestScore = calculateInterestScoreFromAnswers(simulation.answers);
  const finalScore = calculateFinalScore(candidate.matchScore, interestScore);

  const rankedCandidates = candidates
    .map((item) =>
      item.id === candidate.id
        ? {
            ...item,
            conversation,
            answers: simulation.answers,
            chatSource: simulation.source,
            interestScore,
            finalScore,
            tag: deriveCandidateTag(item.matchScore, interestScore),
          }
        : item,
    )
    .sort((a, b) => b.finalScore - a.finalScore);

  const saved = await saveLatestResults({
    ...latestResults,
    rankedCandidates,
    matches: rankedCandidates,
  });

  return res.json({
    candidateId: candidate.id,
    answers: simulation.answers,
    conversation,
    interestScore,
    finalScore,
    source: simulation.source,
    rankedCandidates: saved.rankedCandidates,
  });
}
