"use client";

import Link from "next/link";
import { useState } from "react";
import { PageLayout } from "@/components/page-layout";
import type { QuestionUnitGroup } from "@/types/question";

type QuestionListProps = {
  unitGroups: QuestionUnitGroup[];
  basePath?: string;
};

export function QuestionList({ unitGroups, basePath = "/exercise" }: QuestionListProps) {
  const [openUnits, setOpenUnits] = useState<Set<string>>(new Set());

  const toggleUnit = (unit: string) => {
    setOpenUnits((prev) => {
      const next = new Set(prev);
      if (next.has(unit)) {
        next.delete(unit);
      } else {
        next.add(unit);
      }
      return next;
    });
  };

  return (
    <PageLayout title="問題一覧">
      <div className="flex flex-1 flex-col gap-3">
        {unitGroups.map(({ unit, questions }) => {
          const isOpen = openUnits.has(unit);

          return (
            <section key={unit} className="accordion">
              <button
                type="button"
                className="accordion-trigger"
                aria-expanded={isOpen}
                onClick={() => toggleUnit(unit)}
              >
                <span className="accordion-title">{unit}</span>
                <span className="accordion-count">{questions.length}問</span>
                <span className="accordion-icon" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <ul className="accordion-panel">
                  {questions.map((question) => (
                    <li key={question.id}>
                      <Link
                        href={`${basePath}/${question.id}`}
                        className="question-link"
                      >
                        <span className="question-order">問{question.order}</span>
                        <span className="question-text">{question.problemText}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          );
        })}

        <Link href="/" className="btn btn-outline mt-4">
          トップへ戻る
        </Link>
      </div>
    </PageLayout>
  );
}
