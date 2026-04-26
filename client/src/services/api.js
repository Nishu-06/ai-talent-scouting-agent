const API_BASE_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function parseJobDescription(jobDescription) {
  return request("/jd/parse", {
    method: "POST",
    body: JSON.stringify({ jobDescription }),
  });
}

export function matchCandidates(jobDescription) {
  return request("/match", {
    method: "POST",
    body: JSON.stringify({ jobDescription }),
  });
}

export function assessCandidateInterest(candidate, questions) {
  return request("/chat", {
    method: "POST",
    body: JSON.stringify({
      candidateId: candidate.id,
      candidate,
      questions,
    }),
  });
}

export function fetchResults() {
  return request("/results");
}
