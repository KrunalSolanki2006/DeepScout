import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { investigationsApi } from "../api/investigations.js";
import { useAuth } from "./AuthContext.jsx";

const InvestigationContext = createContext(null);

export const STAGES = [
  { id: "understand", label: "Understanding the question" },
  { id: "decompose", label: "Breaking it into focused questions" },
  { id: "evidence", label: "Gathering evidence from authoritative sources" },
  { id: "compare", label: "Comparing findings and analyzing differences" },
  { id: "conclusion", label: "Building conclusion" },
];

export const InvestigationProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [activeInvestigation, setActiveInvestigation] = useState(null);
  const [investigating, setInvestigating] = useState(false);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [investigationError, setInvestigationError] = useState(null);
  const [lastSubmittedQuestion, setLastSubmittedQuestion] = useState(null);

  const stageTimerRef = useRef(null);
  const elapsedTimerRef = useRef(null);

  // Load history from backend - only when authenticated
  const loadHistory = useCallback(async () => {
    if (!isAuthenticated) {
      setHistory([]);
      return;
    }
    setHistoryLoading(true);
    try {
      const data = await investigationsApi.getAll();
      const list = data?.data?.items || data?.investigations;
      if (Array.isArray(list)) {
        setHistory(list);
      }
    } catch (err) {
      console.warn("Could not load investigation history:", err.message);
    } finally {
      setHistoryLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadHistory();
    } else {
      setHistory([]);
      setActiveInvestigation(null);
    }
  }, [isAuthenticated, loadHistory]);

  // Clean timers
  const clearTimers = () => {
    if (stageTimerRef.current) clearInterval(stageTimerRef.current);
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
  };

  // Select an investigation from history
  const selectInvestigation = async (id) => {
    setInvestigationError(null);
    try {
      const doc = await investigationsApi.getById(id);
      setActiveInvestigation(doc);
      return doc;
    } catch (err) {
      setInvestigationError(err.message || "Failed to load stored investigation.");
      throw err;
    }
  };

  // Start new investigation
  const startInvestigation = async ({ question, sourceType = "web" }) => {
    setInvestigationError(null);
    setInvestigating(true);
    setCurrentStageIndex(0);
    setElapsedSeconds(0);
    setLastSubmittedQuestion({ question, sourceType });
    setActiveInvestigation(null);

    // Timed progression through realistic investigation stages
    // Backend search, extraction, and synthesis typically take 25 - 60 seconds
    const stageDurations = [4000, 10000, 10000, 12000]; // milliseconds per step
    let currentIdx = 0;

    const advanceStage = () => {
      if (currentIdx < STAGES.length - 1) {
        currentIdx += 1;
        setCurrentStageIndex(currentIdx);
      }
    };

    let accumulatedTime = 0;
    const timeouts = stageDurations.map((duration) => {
      accumulatedTime += duration;
      return setTimeout(advanceStage, accumulatedTime);
    });

    elapsedTimerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    try {
      const result = await investigationsApi.investigate({ question, sourceType });
      setActiveInvestigation(result);

      // Refresh history list so newly created investigation appears
      loadHistory();
      return result;
    } catch (err) {
      setInvestigationError({
        message: err.message || "DeepScout couldn't complete this investigation. Please try again.",
        status: err.status,
        details: err.details,
      });
      throw err;
    } finally {
      timeouts.forEach(clearTimeout);
      clearTimers();
      setInvestigating(false);
    }
  };

  const deleteHistoryItem = async (id) => {
    try {
      await investigationsApi.delete(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (activeInvestigation?.id === id) {
        setActiveInvestigation(null);
      }
    } catch (err) {
      console.error("Failed to delete investigation:", err);
      throw err;
    }
  };

  const clearActiveInvestigation = () => {
    setActiveInvestigation(null);
    setInvestigationError(null);
  };

  const retryLastInvestigation = () => {
    if (lastSubmittedQuestion) {
      return startInvestigation(lastSubmittedQuestion);
    }
  };

  return (
    <InvestigationContext.Provider
      value={{
        history,
        historyLoading,
        activeInvestigation,
        investigating,
        currentStageIndex,
        elapsedSeconds,
        investigationError,
        lastSubmittedQuestion,
        loadHistory,
        selectInvestigation,
        startInvestigation,
        deleteHistoryItem,
        clearActiveInvestigation,
        retryLastInvestigation,
      }}
    >
      {children}
    </InvestigationContext.Provider>
  );
};

export const useInvestigation = () => {
  const context = useContext(InvestigationContext);
  if (!context) {
    throw new Error("useInvestigation must be used within an InvestigationProvider");
  }
  return context;
};
