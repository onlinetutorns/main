"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { PageLayout } from "@/components/page-layout";
import { StudentStatusSection } from "@/components/student-status-section";
import type { StudentStatus } from "@/types/student-status";
import { formatQuestionTitle, type Question } from "@/types/question";

type ExplanationPageProps = {
  questions: Question[];
  exerciseStatuses: StudentStatus[];
  explanationStatuses: StudentStatus[];
};

export function ExplanationPage({
  questions,
  exerciseStatuses,
  explanationStatuses,
}: ExplanationPageProps) {
  const [index, setIndex] = useState(0);

  const question = questions[index];
  const hasNext = index < questions.length - 1;

  const goToNext = useCallback(() => {
    if (!hasNext) return;
    setIndex((current) => current + 1);
  }, [hasNext]);

  return (
    <PageLayout title={formatQuestionTitle(questions, question.id)}>
      <div className="flex flex-1 flex-col gap-5">
        <section className="rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <h2 className="mb-2 text-sm font-semibold text-blue-600">説明文</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-zinc-900">
            {question.explanation}
          </p>
        </section>

        <StudentStatusSection
          exerciseStatuses={exerciseStatuses}
          explanationStatuses={explanationStatuses}
          defaultStage="explanation"
        />

        <div className="mt-auto flex flex-col gap-3 pt-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={goToNext}
            disabled={!hasNext}
          >
            次の説明に進む
          </button>
          <Link href="/" className="btn btn-outline">
            トップへ戻る
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
