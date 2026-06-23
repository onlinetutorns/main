import { createClient } from "@/lib/supabase/server";
import type { StudentStatus } from "@/types/student-status";

export { getUniqueParts } from "@/types/student-status";

export const LEARNING_STAGE = {
  EXERCISE: "演習中",
  EXPLANATION: "説明中",
} as const;

const LEARNING_STAGE_COLUMN = "Learning Stage";

type StudentStatusRow = {
  id: string;
  part: string;
  reaction: string;
  action: string;
};

export async function getStudentStatusesByLearningStage(
  learningStage: string,
): Promise<StudentStatus[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("student_statuses")
    .select("id, part, reaction, action")
    .eq(LEARNING_STAGE_COLUMN, learningStage);

  if (error) {
    throw new Error(`生徒の様子の取得に失敗しました: ${error.message}`);
  }

  return (data as StudentStatusRow[]).map((row) => ({
    id: row.id,
    part: row.part,
    reaction: row.reaction,
    action: row.action,
  }));
}

export function getExerciseStudentStatuses() {
  return getStudentStatusesByLearningStage(LEARNING_STAGE.EXERCISE);
}

export function getExplanationStudentStatuses() {
  return getStudentStatusesByLearningStage(LEARNING_STAGE.EXPLANATION);
}
