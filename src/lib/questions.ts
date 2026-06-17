import { createClient } from "@/lib/supabase/server";
import type { Question } from "@/types/question";

type QuestionRow = {
  id: string;
  question: string;
  solution: string;
  order: number;
  unit: string | null;
  "Difficulty Level": string | number | null;
  Priority: string | number | null;
};

export async function getQuestions(): Promise<Question[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("questions")
    .select('id, question, solution, order, unit, "Difficulty Level", Priority')
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`問題の取得に失敗しました: ${error.message}`);
  }

  return (data as QuestionRow[]).map((row) => ({
    id: row.id,
    problemText: row.question,
    explanation: row.solution,
    order: row.order,
    unit: row.unit ?? "",
    difficultyLevel:
      row["Difficulty Level"] === null || row["Difficulty Level"] === undefined
        ? ""
        : String(row["Difficulty Level"]),
    priority:
      row.Priority === null || row.Priority === undefined
        ? ""
        : String(row.Priority),
  }));
}
