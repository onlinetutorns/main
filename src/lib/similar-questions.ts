import { createClient } from "@/lib/supabase/server";
import type {
  SimilarQuestion,
  SimilarQuestionsByQuestionId,
} from "@/types/similar-question";

type SimilarQuestionRow = {
  id: string;
  question_id: string;
  question: string;
  solution: string;
  order: number;
};

export async function getSimilarQuestions(
  questionId: string,
): Promise<SimilarQuestion[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("similar_questions")
    .select("id, question_id, question, solution, order")
    .eq("question_id", questionId)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`類題の取得に失敗しました: ${error.message}`);
  }

  return (data as SimilarQuestionRow[]).map((row) => ({
    id: row.id,
    questionId: row.question_id,
    problemText: row.question,
    explanation: row.solution,
    order: row.order,
  }));
}

export async function getSimilarQuestionsMap(
  questionIds: string[],
): Promise<SimilarQuestionsByQuestionId> {
  if (questionIds.length === 0) {
    return {};
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("similar_questions")
    .select("id, question_id, question, solution, order")
    .in("question_id", questionIds)
    .order("order", { ascending: true });

  if (error) {
    throw new Error(`類題の取得に失敗しました: ${error.message}`);
  }

  const map: SimilarQuestionsByQuestionId = {};

  for (const row of data as SimilarQuestionRow[]) {
    const similarQuestion: SimilarQuestion = {
      id: row.id,
      questionId: row.question_id,
      problemText: row.question,
      explanation: row.solution,
      order: row.order,
    };

    if (!map[row.question_id]) {
      map[row.question_id] = [];
    }
    map[row.question_id].push(similarQuestion);
  }

  return map;
}
