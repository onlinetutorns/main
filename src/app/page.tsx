import Link from "next/link";
import { PageLayout } from "@/components/page-layout";

export default function Home() {
  return (
    <PageLayout title="モードを選択">
      <div className="flex flex-1 flex-col justify-center gap-4 sm:gap-5">
        <Link href="/exercise" className="btn btn-primary">
          演習
        </Link>
        <Link href="/explanation" className="btn btn-outline">
          説明
        </Link>
      </div>
    </PageLayout>
  );
}
