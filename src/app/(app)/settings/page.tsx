import { CompanionSettings } from "@/features/settings/components/companion-settings";
import { DeleteAccount } from "@/features/settings/components/delete-account";
import { getCompanionSettings } from "@/features/chat/actions";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { DownloadCloud, Settings2 } from "lucide-react";

export const metadata = {
  title: "Settings | M.A.X",
};

export default async function SettingsPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/sign-in");
  }

  const companion = await getCompanionSettings(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center rounded-full border border-ink/10 px-2.5 py-0.5 text-xs font-semibold text-ink/60 mb-2">
            <Settings2 className="w-4 h-4 mr-1.5" /> Preferences
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-ink">
            Settings
          </h1>
          <p className="text-lg text-ink/70 leading-relaxed">
            Manage your AI companion and data export preferences.
          </p>
        </div>

        <div className="bg-surface rounded-2xl p-8 border border-ink/5 shadow-sm space-y-8">
          <div>
            <h2 className="text-2xl font-bold font-display text-ink mb-2">Your Companion</h2>
            <p className="text-ink/60 text-sm mb-6">
              Customize how your AI companion speaks and interacts with you.
            </p>
            <CompanionSettings 
              userId={session.user.id} 
              initialName={companion.name} 
              initialTone={companion.tone} 
            />
          </div>

          <div className="pt-8 border-t border-ink/5">
            <h2 className="text-2xl font-bold font-display text-ink mb-2">Data Export</h2>
            <p className="text-ink/60 text-sm mb-6 max-w-md">
              Download everything M.A.X holds about you — your conversations,
              journal entries, check-ins, screener results and journeys. Your
              data is yours.
            </p>
            
            <a 
              href="/api/export"
              download
              className="inline-flex items-center justify-center bg-ink text-surface px-6 py-3 rounded-full font-bold text-sm hover:bg-ink/90 transition-colors"
            >
              <DownloadCloud className="w-4 h-4 mr-2" />
              Export My Data (JSON)
            </a>
            <div className="pt-6 mt-6 border-t border-signal/20">
              <h3 className="text-lg font-bold font-display text-signal mb-2">Danger Zone</h3>
              <p className="text-ink/60 text-sm mb-4 max-w-md">
                Permanently delete your account and all associated data. This action is irreversible.
              </p>
              <DeleteAccount />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
