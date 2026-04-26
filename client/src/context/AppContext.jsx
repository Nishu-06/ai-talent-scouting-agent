import { createContext, useContext, useState } from "react";
import { assessCandidateInterest, fetchResults, matchCandidates, parseJobDescription } from "../services/api";

const AppContext = createContext(null);

const defaultState = {
  jobDescription: "",
  parsedJd: null,
  rankedCandidates: [],
  loading: false,
  assessingCandidateId: "",
  error: "",
};

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);

  async function handleParseAndMatch(jobDescription) {
    setState((current) => ({ ...current, loading: true, error: "", jobDescription }));

    try {
      const parsedJd = await parseJobDescription(jobDescription);
      const matchResponse = await matchCandidates(jobDescription);

      setState((current) => ({
        ...current,
        loading: false,
        parsedJd,
        rankedCandidates: matchResponse.rankedCandidates || matchResponse.matches || [],
      }));

      return parsedJd;
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error.message || "Unable to process the job description.",
      }));
      throw error;
    }
  }

  async function handleAssessCandidate(candidate, questions) {
    setState((current) => ({
      ...current,
      loading: true,
      assessingCandidateId: candidate.id,
      error: "",
    }));

    try {
      const response = await assessCandidateInterest(candidate, questions);
      setState((current) => ({
        ...current,
        loading: false,
        assessingCandidateId: "",
        rankedCandidates: response.rankedCandidates || current.rankedCandidates,
      }));
      return response;
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        assessingCandidateId: "",
        error: error.message || "Unable to assess interest.",
      }));
      throw error;
    }
  }

  async function handleRefreshResults() {
    setState((current) => ({ ...current, loading: true, error: "" }));

    try {
      const results = await fetchResults();
      setState((current) => ({
        ...current,
        loading: false,
        assessingCandidateId: "",
        jobDescription: results.jobDescription || current.jobDescription,
        parsedJd: results.parsedJd || current.parsedJd,
        rankedCandidates: results.rankedCandidates || [],
      }));
      return results;
    } catch (error) {
      setState((current) => ({
        ...current,
        loading: false,
        error: error.message || "Unable to fetch latest results.",
      }));
      throw error;
    }
  }

  const value = {
    ...state,
    parseAndMatch: handleParseAndMatch,
    assessCandidate: handleAssessCandidate,
    refreshResults: handleRefreshResults,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }

  return context;
}
