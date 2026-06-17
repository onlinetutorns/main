export type Question = {
  id: string;
  problemText: string;
  explanation: string;
  order: number;
  unit: string;
  difficultyLevel: string;
  priority: string;
};

export type QuestionUnitGroup = {
  unit: string;
  questions: Question[];
};

export function groupQuestionsByUnit(questions: Question[]): QuestionUnitGroup[] {
  const groups = new Map<string, Question[]>();
  const unitOrder: string[] = [];

  for (const question of questions) {
    const unit = question.unit.trim() || "未分類";
    if (!groups.has(unit)) {
      groups.set(unit, []);
      unitOrder.push(unit);
    }
    groups.get(unit)!.push(question);
  }

  return unitOrder.map((unit) => ({
    unit,
    questions: groups.get(unit)!,
  }));
}

export function getQuestionIndex(questions: Question[], id: string): number {
  return questions.findIndex((q) => q.id === id);
}

export function getQuestionById(
  questions: Question[],
  id: string,
): Question | undefined {
  return questions.find((q) => q.id === id);
}

export function getQuestionNumberInUnit(
  questions: Question[],
  questionId: string,
): { unit: string; numberInUnit: number } {
  const question = getQuestionById(questions, questionId);
  if (!question) {
    return { unit: "未分類", numberInUnit: 1 };
  }

  const unit = question.unit.trim() || "未分類";
  const unitQuestions = questions.filter(
    (q) => (q.unit.trim() || "未分類") === unit,
  );
  const numberInUnit = unitQuestions.findIndex((q) => q.id === questionId) + 1;

  return { unit, numberInUnit };
}

export function formatQuestionTitle(
  questions: Question[],
  questionId: string,
): string {
  const { unit, numberInUnit } = getQuestionNumberInUnit(questions, questionId);
  return `${unit} ${numberInUnit}問目`;
}
