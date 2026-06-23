import Link from "next/link";
import { notFound } from "next/navigation";
import { ExercisePage } from "@/components/exercise-page";
import { PageLayout } from "@/components/page-layout";
import { getAllNodes } from "@/lib/nodes";
import { getQuestions } from "@/lib/questions";
import { getSimilarQuestionsMap } from "@/lib/similar-questions";
import { getQuestionById } from "@/types/question";

type StudentDetailRouteProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ origin?: string }>;
};

export default async function StudentDetailRoute({
  params,
  searchParams,
}: StudentDetailRouteProps) {
  const { id } = await params;
  const { origin } = await searchParams;
  let questions;
  let similarQuestionsMap;
  let nodeRows;

  try {
    questions = await getQuestions();
    [similarQuestionsMap, nodeRows] = await Promise.all([
      getSimilarQuestionsMap(questions.map((q) => q.id)),
      getAllNodes(),
    ]);
  } catch {
    return (
      <PageLayout title="演習">
        <p className="text-center text-zinc-700">
          問題の読み込みに失敗しました。しばらくしてから再度お試しください。
        </p>
        <Link href="/student" className="btn btn-outline mt-6">
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
      nodeRows={nodeRows}
      initialOriginParam={origin ?? null}
      initialQuestionId={question.id}
      showStudentStatus={false}
      collapseExplanation
      basePath="/student"
    />
  );
}
