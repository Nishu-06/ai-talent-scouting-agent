import { parseJobDescription } from "../services/openaiService.js";

export async function parseJdController(req, res) {
  const { jobDescription } = req.body;

  if (!jobDescription?.trim()) {
    return res.status(400).json({ message: "Job description is required." });
  }

  const parsedJd = await parseJobDescription(jobDescription);
  return res.json(parsedJd);
}
