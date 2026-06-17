import Link from "next/link";
import { notFound } from "next/navigation";
import { ExercisePage } from "@/components/exercise-page";
import { PageLayout } from "@/components/page-layout";
import { getQuestions } from "@/lib/questions";
import { getSimilarQuestionsMap } from "@/lib/similar-questions";
import { getExerciseStudentStatuses } from "@/lib/student-statuses";
import { getQuestionById } from "@/types/question";

type ExerciseDetailRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function ExerciseDetailRoute({ params }: ExerciseDetailRouteProps) {
  const { id } = await params;
  let questions;
  let similarQuestionsMap;
  let studentStatuses;

  try {
    questions = await getQuestions();
    [similarQuestionsMap, studentStatuses] = await Promise.all([
      getSimilarQuestionsMap(questions.map((q) => q.id)),
      getExerciseStudentStatuses(),
    ]);
  } catch {
    return (
      <PageLayout title="演習">
        <p className="text-center text-zinc-700">
          問題の読み込みに失敗しました。しばらくしてから再度お試しください。
        </p>
        <Link href="/exercise" className="btn btn-outline mt-6">
          問題一覧へ戻る
        </Link>
      </PageLayout>
    );
  }

  const question = getQuestionById(questions, id);

  if (!question) {
    notFound();
  }

  return (
    <ExercisePage
      questions={questions}
      similarQuestionsMap={similarQuestionsMap}
      studentStatuses={studentStatuses}
      initialQuestionId={question.id}
    />
  );
}
