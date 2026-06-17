import Link from "next/link";
import { ExplanationPage } from "@/components/explanation-page";
import { PageLayout } from "@/components/page-layout";
import { getQuestions } from "@/lib/questions";
import {
  getExerciseStudentStatuses,
  getExplanationStudentStatuses,
} from "@/lib/student-statuses";

export default async function ExplanationRoute() {
  let questions;
  let exerciseStatuses;
  let explanationStatuses;

  try {
    [questions, exerciseStatuses, explanationStatuses] = await Promise.all([
      getQuestions(),
      getExerciseStudentStatuses(),
      getExplanationStudentStatuses(),
    ]);
  } catch {
    return (
      <PageLayout title="説明">
        <p className="text-center text-zinc-700">
          説明の読み込みに失敗しました。しばらくしてから再度お試しください。
        </p>
        <Link href="/" className="btn btn-outline mt-6">
          トップへ戻る
        </Link>
      </PageLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <PageLayout title="説明">
        <p className="text-center text-zinc-700">表示できる説明がありません。</p>
        <Link href="/" className="btn btn-outline mt-6">
          トップへ戻る
        </Link>
      </PageLayout>
    );
  }

  return (
    <ExplanationPage
      questions={questions}
      exerciseStatuses={exerciseStatuses}
      explanationStatuses={explanationStatuses}
    />
  );
}
