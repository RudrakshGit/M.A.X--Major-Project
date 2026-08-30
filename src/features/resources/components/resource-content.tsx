import { ResourceTopic } from "@/content/resources";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function ResourceContent({ topic }: { topic: ResourceTopic }) {
  return (
    <article className="max-w-3xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center rounded-full border border-ink/10 px-2.5 py-0.5 text-xs font-semibold text-ink/60 mb-2">
          Psycho-education
        </div>
        <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">
          {topic.title}
        </h1>
        <p className="text-lg md:text-xl text-ink/70 leading-relaxed">
          {topic.introduction}
        </p>
      </div>

      {/* Signs */}
      <section className="bg-surface rounded-2xl p-6 md:p-8 shadow-sm border border-ink/5">
        <h2 className="text-2xl font-display font-bold text-ink mb-6 flex items-center gap-2">
          <AlertCircle className="w-6 h-6 text-ink/50" />
          Signs to Look Out For
        </h2>
        <ul className="space-y-3">
          {topic.signs.map((sign, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-ink/30 mt-2 shrink-0" />
              <span className="text-ink/80 leading-relaxed">{sign}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Strategies */}
      <section className="space-y-6">
        <h2 className="text-2xl font-display font-bold text-ink mb-6 flex items-center gap-2">
          <CheckCircle2 className="w-6 h-6 text-ink/50" />
          Actionable Coping Strategies
        </h2>
        <div className="grid gap-6">
          {topic.strategies.map((strategy, index) => (
            <div key={index} className="bg-surface p-6 rounded-xl border border-ink/5 shadow-sm">
              <h3 className="text-lg font-bold text-ink mb-2">{strategy.title}</h3>
              <p className="text-ink/70 leading-relaxed">{strategy.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Crisis Escalation */}
      <section className="bg-ink/5 p-6 md:p-8 rounded-2xl border border-ink/10">
        <div className="flex gap-4">
          <AlertTriangle className="w-6 h-6 text-ink shrink-0" />
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-ink">When to Seek Immediate Help</h3>
            <p className="text-ink/80 leading-relaxed font-medium">
              {topic.crisisEscalation}
            </p>
            <div className="pt-2">
              <Link href="/">
                <Button className="rounded-full bg-ink hover:bg-ink/90 text-surface">
                  Talk to M.A.X
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}
