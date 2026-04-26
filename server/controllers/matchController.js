import { parseJobDescription } from "../services/openaiService.js";
import { matchCandidates } from "../services/matchingService.js";
import { getLatestResults, saveLatestResults } from "../services/resultsStore.js";
import { readJsonFile } from "../utils/jsonStore.js";

export async function matchCandidatesController(req, res) {
  const { jobDescription } = req.body;

  if (!jobDescription?.trim()) {
    return res.status(400).json({ message: "Job description is required." });
  }

  const candidates = await readJsonFile("candidates.json");
  const previousResults = await getLatestResults();
  const parsedJd = await parseJobDescription(jobDescription);

  const interestLookup = Object.fromEntries(
    (previousResults.rankedCandidates || []).map((candidate) => [
      candidate.id,
      {
        interestScore: candidate.interestScore,
        conversation: candidate.conversation,
      },
    ]),
  );

  const matches = matchCandidates(parsedJd, candidates, interestLookup);

  const saved = await saveLatestResults({
    jobDescription,
    parsedJd,
    matches,
    rankedCandidates: matches,
  });

  return res.json(saved);
}
