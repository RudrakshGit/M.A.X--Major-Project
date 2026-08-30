import { resources } from "@/content/resources";
import { ResourceCard } from "@/features/resources/components/resource-card";

export const metadata = {
  title: "Resources | M.A.X",
  description: "Psycho-educational resources for students.",
};

export default function ResourcesIndexPage() {
  const topics = Object.values(resources);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8 pb-20">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="space-y-4 max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">
            Resource Library
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            Curated, clinically-informed guides to help you understand what you&apos;re experiencing and discover actionable coping strategies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic) => (
            <ResourceCard key={topic.id} topic={topic} />
          ))}
        </div>
      </div>
    </div>
  );
}
