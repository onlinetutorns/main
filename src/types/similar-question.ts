export type SimilarQuestion = {
  id: string;
  questionId: string;
  problemText: string;
  explanation: string;
  order: number;
};

export type SimilarQuestionsByQuestionId = Record<string, SimilarQuestion[]>;

export function getSimilarQuestionsForQuestion(
  similarQuestionsMap: SimilarQuestionsByQuestionId,
  questionId: string,
): SimilarQuestion[] {
  return similarQuestionsMap[questionId] ?? [];
}
