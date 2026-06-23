import Link from "next/link";
import { QuestionList } from "@/components/question-list";
import { PageLayout } from "@/components/page-layout";
import { getQuestions } from "@/lib/questions";
import { groupQuestionsByUnit } from "@/types/question";

export default async function StudentListRoute() {
  let questions;

  try {
    questions = await getQuestions();
  } catch {
    return (
      <PageLayout title="問題一覧">
        <p className="text-center text-zinc-700">
          問題の読み込みに失敗しました。しばらくしてから再度お試しください。
        </p>
        <Link href="/" className="btn btn-outline mt-6">
          トップへ戻る
        </Link>
      </PageLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <PageLayout title="問題一覧">
        <p className="text-center text-zinc-700">表示できる問題がありません。</p>
        <Link href="/" className="btn btn-outline mt-6">
          トップへ戻る
        </Link>
      </PageLayout>
    );
  }

  return (
    <QuestionList
      unitGroups={groupQuestionsByUnit(questions)}
      basePath="/student"
    />
  );
}
