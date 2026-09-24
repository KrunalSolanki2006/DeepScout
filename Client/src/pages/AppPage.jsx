import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell.jsx";
import { QuestionInput } from "../components/investigation/QuestionInput.jsx";
import { ProgressTracker } from "../components/investigation/ProgressTracker.jsx";
import { ResultView } from "../components/investigation/ResultView.jsx";
import { ErrorAlert } from "../components/ui/ErrorAlert.jsx";
import { InvestigationSkeleton } from "../components/ui/Skeleton.jsx";
import { useInvestigation } from "../context/InvestigationContext.jsx";

export const AppPage = () => {
  const { id } = useParams();
  const {
    activeInvestigation,
    investigating,
    investigationError,
    retryLastInvestigation,
    selectInvestigation,
    clearActiveInvestigation,
  } = useInvestigation();

  useEffect(() => {
    if (id) {
      if (activeInvestigation?.id !== id && activeInvestigation?._id !== id) {
        selectInvestigation(id).catch((err) => {
          console.warn("Could not load investigation by id:", err);
        });
      }
    } else {
      // On /app route: clear any loaded investigation so the new question view is active
      if (activeInvestigation) {
        clearActiveInvestigation();
      }
    }
  }, [id, activeInvestigation, clearActiveInvestigation, selectInvestigation]);

  return (
    <AppShell>
      <div className="flex-1 flex flex-col min-h-full w-full">
        {investigationError && !investigating && (
          <div className="max-w-3xl mx-auto mb-4 px-4 pt-4 w-full">
            <ErrorAlert
              title="Investigation Failed"
              message={investigationError.message}
              details={investigationError.details}
              onRetry={retryLastInvestigation}
            />
          </div>
        )}

        {investigating ? (
          <div className="flex-1 flex flex-col justify-center items-center py-6 px-4 md:px-8 my-auto">
            <ProgressTracker />
          </div>
        ) : id ? (
          activeInvestigation &&
          (activeInvestigation.id === id || activeInvestigation._id === id) ? (
            <div className="py-6 px-4 md:px-8">
              <ResultView result={activeInvestigation} />
            </div>
          ) : (
            <div className="py-6 px-4 md:px-8">
              <InvestigationSkeleton />
            </div>
          )
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center w-full px-4 sm:px-6 my-auto">
            <QuestionInput />
          </div>
        )}
      </div>
    </AppShell>
  );
};
