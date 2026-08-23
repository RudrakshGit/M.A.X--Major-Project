import { ResourceTopic } from "@/content/resources";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ResourceCard({ topic }: { topic: ResourceTopic }) {
  return (
    <Link href={`/resources/${topic.id}`} className="block group">
      <div className="h-full bg-surface p-6 rounded-2xl border border-ink/5 hover:border-ink/20 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
        <h3 className="text-xl font-bold font-display text-ink mb-2 group-hover:text-ink/80 transition-colors">
          {topic.title}
        </h3>
        <p className="text-ink/70 text-sm mb-6 leading-relaxed line-clamp-3">
          {topic.shortDescription}
        </p>
        <div className="flex items-center text-sm font-semibold text-ink/60 group-hover:text-ink transition-colors mt-auto">
          Read more <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
