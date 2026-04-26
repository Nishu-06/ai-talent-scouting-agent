import { readJsonFile, writeJsonFile } from "../utils/jsonStore.js";

const FILE_NAME = "results-cache.json";

export async function getLatestResults() {
  return readJsonFile(FILE_NAME);
}

export async function saveLatestResults(payload) {
  const data = {
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  await writeJsonFile(FILE_NAME, data);
  return data;
}
