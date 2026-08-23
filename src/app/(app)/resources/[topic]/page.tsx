import { resources } from "@/content/resources";
import { ResourceContent } from "@/features/resources/components/resource-content";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicId } = await params;
  const topic = resources[topicId];
  if (!topic) return { title: "Not Found" };
  
  return {
    title: `${topic.title} | MAX Resources`,
  };
}

export default async function ResourceTopicPage({ params }: { params: Promise<{ topic: string }> }) {
  const { topic: topicId } = await params;
  const topic = resources[topicId];
  if (!topic) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] px-4 md:px-8 pt-24">
      <div className="max-w-3xl mx-auto mb-8">
        <Link 
          href="/resources" 
          className="inline-flex items-center text-sm font-semibold text-ink/60 hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Library
        </Link>
      </div>
      <ResourceContent topic={topic} />
    </div>
  );
}

// Generate static params for all known topics since it's a static CMS
export function generateStaticParams() {
  return Object.keys(resources).map((topicId) => ({
    topic: topicId,
  }));
}
