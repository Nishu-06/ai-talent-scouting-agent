import { getLatestResults } from "../services/resultsStore.js";

export async function getResultsController(req, res) {
  const results = await getLatestResults();
  return res.json(results);
}
