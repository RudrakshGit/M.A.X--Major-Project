import type { Metadata } from "next";
import { Sketch } from "@/components/Sketch";
import { ButtonLink, Page } from "@/components/ui";
import { APK } from "@/content/app";

export const metadata: Metadata = { title: "Download the app", description: `MAX for Android, version ${APK.version}. Free, ${APK.sizeMb} MB.` };

// No sign-in to download: the APK is public anyway, and an account would only add friction and personal data.
export default function Download() {
  return (
    <Page>
      <section className="mx-auto max-w-2xl space-y-8 py-10">
        <div className="space-y-3">
          <h1 className="font-display text-4xl font-semibold">Get MAX for Android</h1>
          <p className="text-lg text-ink2">Free. Reminders, voice notes, backup and no daily chat limit.</p>
        </div>
        <Sketch id="apk" className="space-y-4 p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="font-display text-xl font-semibold">MAX {APK.version}</p>
            <p className="text-sm text-ink3">{APK.sizeMb} MB · {APK.minAndroid}</p>
          </div>
          <div className="pt-3">
          <ButtonLink href={APK.url} external>
            Download the APK
          </ButtonLink>
          </div>
        </Sketch>
        <div className="space-y-3">
          <h2 className="font-display text-2xl font-semibold">Installing it</h2>
          <ol className="list-decimal space-y-2 pl-5 text-ink2">
            <li>Open the downloaded file. Android may ask to allow installs from your browser: allow it for this one install.</li>
            <li>Tap Install, then Open.</li>
            <li>MAX isn&apos;t on the Play Store yet, so Play Protect may ask you to confirm. That&apos;s expected for apps from outside the store.</li>
          </ol>
        </div>
        <p className="text-ink2">
          On an iPhone or a computer? <a className="font-semibold text-ink underline" href="/try">Try the demo in your browser</a>.
        </p>
      </section>
    </Page>
  );
}
