import Link from "next/link";
import { PageLayout } from "@/components/page-layout";

export default function Home() {
  return (
    <PageLayout title="モードを選択">
      <div className="flex flex-1 flex-col justify-center gap-4 sm:gap-5">
        <Link href="/exercise" className="btn btn-primary">
          講師
        </Link>
        <Link href="/student" className="btn btn-outline">
          生徒
        </Link>
      </div>
    </PageLayout>
  );
}
