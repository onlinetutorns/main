"use client";

import { useState } from "react";
import { AdviceModal } from "@/components/advice-modal";
import type { StudentStatus } from "@/types/student-status";

export type StudentStatusStage = "exercise" | "explanation";

type StudentStatusSectionProps = {
  exerciseStatuses: StudentStatus[];
  explanationStatuses: StudentStatus[];
  defaultStage?: StudentStatusStage;
};

export function StudentStatusSection({
  exerciseStatuses,
  explanationStatuses,
  defaultStage = "exercise",
}: StudentStatusSectionProps) {
  const [stage, setStage] = useState<StudentStatusStage>(defaultStage);
  const [selectedStatus, setSelectedStatus] = useState<StudentStatus | null>(null);

  const studentStatuses =
    stage === "exercise" ? exerciseStatuses : explanationStatuses;

  const switchStage = (nextStage: StudentStatusStage) => {
    setStage(nextStage);
    setSelectedStatus(null);
  };

  return (
    <>
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-zinc-900">生徒の様子</h2>
          <div className="stage-toggle-group">
            <button
              type="button"
              className={`stage-toggle ${stage === "exercise" ? "stage-toggle-active" : ""}`}
              onClick={() => switchStage("exercise")}
            >
              演習
            </button>
            <button
              type="button"
              className={`stage-toggle ${stage === "explanation" ? "stage-toggle-active" : ""}`}
              onClick={() => switchStage("explanation")}
            >
              説明
            </button>
          </div>
        </div>

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

      <AdviceModal
        isOpen={selectedStatus !== null}
        title={`アドバイス：${selectedStatus?.reaction ?? ""}`}
        advice={selectedStatus?.action ?? ""}
        onClose={() => setSelectedStatus(null)}
      />
    </>
  );
}
