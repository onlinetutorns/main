"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AdviceModal } from "@/components/advice-modal";
import { PageLayout } from "@/components/page-layout";
import {
  getSimilarQuestionsForQuestion,
  type SimilarQuestionsByQuestionId,
} from "@/types/similar-question";
import type { StudentStatus } from "@/types/student-status";
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
  studentStatuses: StudentStatus[];
  initialQuestionId: string;
};

export function ExercisePage({
  questions,
  similarQuestionsMap,
  studentStatuses,
  initialQuestionId,
}: ExercisePageProps) {
  const [questionId, setQuestionId] = useState(initialQuestionId);
  const [similarIndex, setSimilarIndex] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<StudentStatus | null>(null);

  const question = getQuestionById(questions, questionId) ?? questions[0];
  const similarQuestions = getSimilarQuestionsForQuestion(
    similarQuestionsMap,
    question.id,
  );
  const questionIndex = getQuestionIndex(questions, question.id);
  const hasPreviousMain = questionIndex > 0;
  const hasNextMain = questionIndex < questions.length - 1;

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
    setSelectedStatus(null);
  }, [hasNextSimilar]);

  const goToNext = useCallback(() => {
    if (!hasNextMain) return;

    setQuestionId(questions[questionIndex + 1].id);
    setSimilarIndex(null);
    setSelectedStatus(null);
  }, [hasNextMain, questionIndex, questions]);

  const goBack = useCallback(() => {
    if (isViewingSimilar) {
      if (similarIndex !== null && similarIndex > 0) {
        setSimilarIndex(similarIndex - 1);
      } else {
        setSimilarIndex(null);
      }
      setSelectedStatus(null);
      return;
    }

    if (hasPreviousMain) {
      setQuestionId(questions[questionIndex - 1].id);
      setSimilarIndex(null);
      setSelectedStatus(null);
    }
  }, [hasPreviousMain, isViewingSimilar, questionIndex, questions, similarIndex]);

  return (
    <PageLayout title={formatQuestionTitle(questions, question.id)}>
      <div className="flex flex-1 flex-col gap-5">
        {isViewingSimilar && (
          <p className="text-center text-sm font-medium text-blue-600">
            類題 {similarIndex! + 1} / {similarQuestions.length}
          </p>
        )}

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

        <section>
          <h2 className="mb-3 text-sm font-semibold text-zinc-900">生徒の様子</h2>
          {studentStatuses.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {studentStatuses.map((status) => (
                <button
                  key={status.id}
                  type="button"
                  className="choice-btn"
                  onClick={() => setSelectedStatus(status)}
                >
                  {status.reaction}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">表示できる生徒の様子がありません。</p>
          )}
        </section>

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
          <Link href="/exercise" className="btn btn-secondary">
            問題一覧へ戻る
          </Link>
          <Link href="/" className="btn btn-outline">
            トップへ戻る
          </Link>
        </div>
      </div>

      <AdviceModal
        isOpen={selectedStatus !== null}
        title={`アドバイス：${selectedStatus?.reaction ?? ""}`}
        advice={selectedStatus?.action ?? ""}
        onClose={() => setSelectedStatus(null)}
      />
    </PageLayout>
  );
}
