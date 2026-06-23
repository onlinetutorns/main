"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { StudentStatusSection } from "@/components/student-status-section";
import {
  getSimilarQuestionsForQuestion,
  type SimilarQuestionsByQuestionId,
} from "@/types/similar-question";
import type { StudentStatus } from "@/types/student-status";
import { resolveNodeNavigation, type NodeRow } from "@/types/node";
import {
  formatQuestionTitle,
  getQuestionById,
  getQuestionIndex,
  type Question,
} from "@/types/question";

type DisplayContent = {
  problemText: string;
  explanation: string;
};

type ExercisePageProps = {
  questions: Question[];
  similarQuestionsMap: SimilarQuestionsByQuestionId;
  nodeRows: NodeRow[];
  initialOriginParam: string | null;
  exerciseStatuses?: StudentStatus[];
  explanationStatuses?: StudentStatus[];
  initialQuestionId: string;
  showStudentStatus?: boolean;
  collapseExplanation?: boolean;
  basePath?: string;
};

export function ExercisePage({
  questions,
  similarQuestionsMap,
  nodeRows,
  initialOriginParam,
  exerciseStatuses = [],
  explanationStatuses = [],
  initialQuestionId,
  showStudentStatus = true,
  collapseExplanation = false,
  basePath = "/exercise",
}: ExercisePageProps) {
  const [questionId, setQuestionId] = useState(initialQuestionId);
  const [originParam, setOriginParam] = useState(initialOriginParam);
  const [similarIndex, setSimilarIndex] = useState<number | null>(null);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const explanationTriggerRef = useRef<HTMLButtonElement>(null);
  const [explanationPanelMaxHeight, setExplanationPanelMaxHeight] = useState<
    number | null
  >(null);

  const measureExplanationPanelHeight = useCallback(() => {
    if (!isExplanationOpen) return;

    const scrollArea = scrollAreaRef.current;
    const trigger = explanationTriggerRef.current;
    if (!scrollArea || !trigger) return;

    const availableHeight =
      scrollArea.getBoundingClientRect().bottom -
      trigger.getBoundingClientRect().bottom;

    setExplanationPanelMaxHeight(Math.max(availableHeight, 0));
  }, [isExplanationOpen]);

  useEffect(() => {
    if (collapseExplanation) {
      setIsExplanationOpen(false);
    }
  }, [collapseExplanation, questionId, similarIndex]);

  const question = getQuestionById(questions, questionId) ?? questions[0];
  const similarQuestions = getSimilarQuestionsForQuestion(
    similarQuestionsMap,
    question.id,
  );
  const questionIndex = getQuestionIndex(questions, question.id);
  const hasPreviousMain = questionIndex > 0;
  const hasNextMain = questionIndex < questions.length - 1;

  const { originQuestionId, previousNodeId } = useMemo(
    () => resolveNodeNavigation(questionId, originParam, nodeRows),
    [questionId, originParam, nodeRows],
  );

  const showReturnToOrigin =
    originQuestionId != null && questionId !== originQuestionId;

  const displayed: DisplayContent =
    similarIndex !== null && similarQuestions[similarIndex]
      ? similarQuestions[similarIndex]
      : question;

  useLayoutEffect(() => {
    if (!collapseExplanation || !isExplanationOpen) return;

    measureExplanationPanelHeight();

    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const observer = new ResizeObserver(measureExplanationPanelHeight);
    observer.observe(scrollArea);
    window.addEventListener("resize", measureExplanationPanelHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measureExplanationPanelHeight);
    };
  }, [
    collapseExplanation,
    isExplanationOpen,
    measureExplanationPanelHeight,
    displayed.problemText,
    displayed.explanation,
    questionId,
    similarIndex,
  ]);

  const isViewingSimilar = similarIndex !== null;
  const hasNextSimilar =
    similarIndex === null
      ? similarQuestions.length > 0
      : similarIndex < similarQuestions.length - 1;
  const hasPrevious = isViewingSimilar || hasPreviousMain;

  const goToSimilar = useCallback(() => {
    if (!hasNextSimilar) return;

    setSimilarIndex((current) => (current === null ? 0 : current + 1));
  }, [hasNextSimilar]);

  const goToNext = useCallback(() => {
    if (!hasNextMain) return;

    setQuestionId(questions[questionIndex + 1].id);
    setOriginParam(null);
    setSimilarIndex(null);
  }, [hasNextMain, questionIndex, questions]);

  const goBack = useCallback(() => {
    if (isViewingSimilar) {
      if (similarIndex !== null && similarIndex > 0) {
        setSimilarIndex(similarIndex - 1);
      } else {
        setSimilarIndex(null);
      }
      return;
    }

    if (hasPreviousMain) {
      setQuestionId(questions[questionIndex - 1].id);
      setOriginParam(null);
      setSimilarIndex(null);
    }
  }, [hasPreviousMain, isViewingSimilar, questionIndex, questions, similarIndex]);

  const previousNodeHref =
    previousNodeId && originQuestionId
      ? `${basePath}/${previousNodeId}?origin=${originQuestionId}`
      : null;

  return (
    <PageLayout title={formatQuestionTitle(questions, question.id)}>
      <div className="exercise-page flex min-h-0 flex-1 flex-col gap-5">
        {isViewingSimilar && (
          <p className="exercise-page-badge text-center text-sm font-medium text-blue-600">
            類題 {similarIndex! + 1} / {similarQuestions.length}
          </p>
        )}

        <div className="exercise-page-content flex min-h-0 flex-1 flex-col overflow-hidden">
          <div
            ref={scrollAreaRef}
            className={`exercise-page-scroll flex min-h-0 flex-1 flex-col gap-5 overscroll-contain${
              collapseExplanation && isExplanationOpen
                ? " overflow-hidden"
                : " overflow-y-auto"
            }`}
          >
            <div
              className={`exercise-page-main flex flex-col gap-5${
                collapseExplanation && isExplanationOpen ? " min-h-0 flex-1" : ""
              }`}
            >
              <section className="content-section problem-section shrink-0 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
                <h2 className="mb-2 text-sm font-semibold text-blue-600">問題文</h2>
                <p className="content-body whitespace-pre-wrap text-zinc-900">
                  {displayed.problemText}
                </p>
              </section>

              <div className="exercise-meta shrink-0 flex gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm sm:px-5">
                <p className="flex-1">
                  <span className="font-medium text-zinc-500">習得難易度</span>
                  <span className="ml-2 text-zinc-900">
                    {question.difficultyLevel || "—"}
                  </span>
                </p>
                <p className="flex-1">
                  <span className="font-medium text-zinc-500">重要度</span>
                  <span className="ml-2 text-zinc-900">{question.priority || "—"}</span>
                </p>
              </div>

              {collapseExplanation ? (
                <section
                  className={`accordion explanation-accordion${
                    isExplanationOpen
                      ? " explanation-accordion--open min-h-0 flex-1"
                      : " shrink-0"
                  }`}
                >
                  <button
                    ref={explanationTriggerRef}
                    type="button"
                    className="accordion-trigger explanation-accordion-trigger"
                    aria-expanded={isExplanationOpen}
                    onClick={() => setIsExplanationOpen((open) => !open)}
                  >
                    <span className="flex-1 text-left text-sm font-semibold text-blue-600">
                      解説
                    </span>
                    <span className="accordion-icon" aria-hidden="true">
                      {isExplanationOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isExplanationOpen ? (
                    <div
                      className="explanation-accordion-panel"
                      style={
                        explanationPanelMaxHeight
                          ? {
                              height: explanationPanelMaxHeight,
                              maxHeight: explanationPanelMaxHeight,
                            }
                          : undefined
                      }
                    >
                      <p className="content-body whitespace-pre-wrap text-zinc-700">
                        {displayed.explanation.trim() || "解説がありません。"}
                      </p>
                    </div>
                  ) : null}
                </section>
              ) : (
                <section className="content-section rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
                  <h2 className="mb-2 text-sm font-semibold text-blue-600">解説</h2>
                  <p className="content-body whitespace-pre-wrap text-zinc-700">
                    {displayed.explanation}
                  </p>
                </section>
              )}
            </div>

            {showStudentStatus ? (
              <div className="exercise-page-sidebar">
                <StudentStatusSection
                  exerciseStatuses={exerciseStatuses}
                  explanationStatuses={explanationStatuses}
                />
              </div>
            ) : null}
          </div>

          <div className="exercise-page-actions flex shrink-0 flex-col gap-3 border-t border-zinc-200 bg-zinc-50 pt-3">
            <div className="exercise-page-actions-row exercise-page-actions-row-primary">
              <button
                type="button"
                className="btn btn-primary"
                onClick={goToSimilar}
                disabled={!hasNextSimilar}
              >
                類題に進む
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={goToNext}
                disabled={!hasNextMain}
              >
                次の問題に進む
              </button>
              {previousNodeHref ? (
                <Link href={previousNodeHref} className="btn btn-secondary">
                  前のノードに戻る
                </Link>
              ) : (
                <button type="button" className="btn btn-secondary" disabled>
                  前のノードに戻る
                </button>
              )}
              {showReturnToOrigin && originQuestionId ? (
                <Link
                  href={`${basePath}/${originQuestionId}`}
                  className="btn btn-secondary"
                >
                  元の問題に戻る
                </Link>
              ) : null}
            </div>
            <div className="exercise-page-actions-row exercise-page-actions-row-secondary">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={goBack}
                disabled={!hasPrevious}
              >
                戻る
              </button>
              <Link href={basePath} className="btn btn-secondary">
                問題一覧へ戻る
              </Link>
              <Link href="/" className="btn btn-outline">
                トップへ戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
