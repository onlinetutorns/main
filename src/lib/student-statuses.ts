import { createClient } from "@/lib/supabase/server";
import type { StudentStatus } from "@/types/student-status";

const EXERCISE_LEARNING_STAGE = "演習中";
const LEARNING_STAGE_COLUMN = "Learning Stage";

type StudentStatusRow = {
  id: string;
  reaction: string;
  action: string;
};

export async function getExerciseStudentStatuses(): Promise<StudentStatus[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("student_statuses")
    .select("id, reaction, action")
    .eq(LEARNING_STAGE_COLUMN, EXERCISE_LEARNING_STAGE);

  if (error) {
    throw new Error(`生徒の様子の取得に失敗しました: ${error.message}`);
  }

  return (data as StudentStatusRow[]).map((row) => ({
    id: row.id,
    reaction: row.reaction,
    action: row.action,
  }));
}
