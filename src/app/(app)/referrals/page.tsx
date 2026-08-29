import { helplines } from "@/content/referrals";
import { Phone, Clock, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Referrals & Helplines | MAX",
  description: "Verified mental health helplines and crisis resources.",
};

export default function ReferralsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-signal/30 bg-signal/10 px-2.5 py-0.5 text-xs font-semibold text-signal mb-2">
            <AlertTriangle className="w-4 h-4 mr-1.5" /> If you are in immediate danger, please call 112
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">
            Helplines & Support
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed max-w-2xl">
            You don&apos;t have to go through this alone. These are verified, free national helplines ready to support you when things feel overwhelming.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {helplines.map((helpline) => (
            <div 
              key={helpline.id} 
              className="bg-surface rounded-2xl p-6 border border-ink/5 shadow-sm hover:border-ink/20 transition-colors flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold font-display text-ink">
                  {helpline.name}
                </h3>
                <div className="inline-flex items-center bg-success/10 text-success text-xs font-bold px-2 py-1 rounded">
                  <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                </div>
              </div>
              
              <p className="text-ink/70 text-sm mb-6 flex-1">
                {helpline.description}
              </p>
              
              <div className="space-y-4 mt-auto">
                <div className="flex flex-wrap gap-2">
                  {helpline.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-ink/5 text-ink/60 text-xs rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-ink/5">
                  <div className="flex items-center text-ink/60 text-sm font-medium">
                    <Clock className="w-4 h-4 mr-2" />
                    {helpline.hours}
                  </div>
                  
                  <a 
                    href={`tel:${helpline.number.replace(/\D/g,'')}`}
                    className="inline-flex items-center justify-center bg-ink text-surface px-4 py-2 rounded-full font-bold text-sm hover:bg-ink/90 transition-colors"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
