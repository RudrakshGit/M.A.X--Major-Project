import { instruments } from "@/content/screeners";
import { ScreenerForm } from "@/features/assessments/components/screener-form";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: { params: Promise<{ instrument: string }> }) {
  const { instrument } = await params;
  const screener = instruments[instrument];
  if (!screener) return { title: "Not Found" };
  
  return {
    title: `${screener.title} | MAX`,
  };
}

export default async function AssessmentPage({ params }: { params: Promise<{ instrument: string }> }) {
  const { instrument } = await params;
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/sign-in");
  }

  const screener = instruments[instrument];
  if (!screener) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 md:px-8 pt-24">
      <ScreenerForm screener={screener} />
    </div>
  );
}
