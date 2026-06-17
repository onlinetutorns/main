"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
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
  exerciseStatuses: StudentStatus[];
  explanationStatuses: StudentStatus[];
  initialQuestionId: string;
};

export function ExercisePage({
  questions,
  similarQuestionsMap,
  nodeRows,
  initialOriginParam,
  exerciseStatuses,
  explanationStatuses,
  initialQuestionId,
}: ExercisePageProps) {
  const [questionId, setQuestionId] = useState(initialQuestionId);
  const [originParam, setOriginParam] = useState(initialOriginParam);
  const [similarIndex, setSimilarIndex] = useState<number | null>(null);

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
      ? `/exercise/${previousNodeId}?origin=${originQuestionId}`
      : null;

  return (
    <PageLayout title={formatQuestionTitle(questions, question.id)}>
      <div className="flex flex-1 flex-col gap-5">
        {isViewingSimilar && (
          <p className="text-center text-sm font-medium text-blue-600">
            類題 {similarIndex! + 1} / {similarQuestions.length}
          </p>
        )}

        <div className="flex gap-4 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm sm:px-5">
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

        <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <h2 className="mb-2 text-sm font-semibold text-blue-600">問題文</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-900">
            {displayed.problemText}
          </p>
        </section>

        <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <h2 className="mb-2 text-sm font-semibold text-blue-600">解説</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-700">
            {displayed.explanation}
          </p>
        </section>

        <StudentStatusSection
          exerciseStatuses={exerciseStatuses}
          explanationStatuses={explanationStatuses}
        />

        <div className="mt-auto flex flex-col gap-3 pt-2">
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={goBack}
            disabled={!hasPrevious}
          >
            戻る
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
              href={`/exercise/${originQuestionId}`}
              className="btn btn-secondary"
            >
              元の問題に戻る
            </Link>
          ) : null}
          <Link href="/exercise" className="btn btn-secondary">
            問題一覧へ戻る
          </Link>
          <Link href="/" className="btn btn-outline">
            トップへ戻る
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
