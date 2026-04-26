import { readJsonFile, writeJsonFile } from "../utils/jsonStore.js";

const FILE_NAME = "results-cache.json";
const defaultResults = {
  jobDescription: "",
  parsedJd: null,
  matches: [],
  rankedCandidates: [],
  updatedAt: null,
};

export async function getLatestResults() {
  try {
    return await readJsonFile(FILE_NAME);
  } catch (error) {
    if (error.code === "ENOENT") {
      await writeJsonFile(FILE_NAME, defaultResults);
      return defaultResults;
    }

    throw error;
  }
}

export async function saveLatestResults(payload) {
  const data = {
    ...defaultResults,
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(FILE_NAME, data);
  return data;
}
