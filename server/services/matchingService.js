import { calculateMatchScore, calculateFinalScore, deriveCandidateTag } from "./scoringService.js";

export function buildExplanation(candidate, matchResult) {
  const matchedText = matchResult.matchedSkills.length
    ? `Matched on ${matchResult.matchedSkills.join(", ")}`
    : "No direct skill overlap found";

  const missingText = matchResult.missingSkills.length
    ? `Missing ${matchResult.missingSkills.join(", ")}`
    : "No major skill gaps";

  const experienceText =
    matchResult.experienceScore >= 85
      ? `Experience is well aligned at ${candidate.experience} years`
      : `Experience is somewhat off at ${candidate.experience} years`;

  return `${matchedText}. ${missingText}. ${experienceText}.`;
}

export function matchCandidates(parsedJd, candidates, existingInterest = {}) {
  const matches = candidates.map((candidate) => {
    const matchResult = calculateMatchScore(parsedJd.skills, parsedJd.experience, candidate);
    const interestScore = existingInterest[candidate.id]?.interestScore ?? 0;
    const finalScore = interestScore
      ? calculateFinalScore(matchResult.matchScore, interestScore)
      : matchResult.matchScore;

    return {
      ...candidate,
      matchScore: matchResult.matchScore,
      interestScore,
      finalScore,
      explanation: buildExplanation(candidate, matchResult),
      matchedSkills: matchResult.matchedSkills,
      missingSkills: matchResult.missingSkills,
      tag: deriveCandidateTag(matchResult.matchScore, interestScore),
      conversation: existingInterest[candidate.id]?.conversation ?? [],
    };
  });

  return matches.sort((a, b) => b.finalScore - a.finalScore);
}
