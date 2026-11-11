"use client";

import { useEffect, useRef, useState } from "react";

// Google's own "Sign in with Google" button (Google Identity Services). It returns an ID token for the MAX server's
// web client id; the site never sees a password. Needs this site's address in the client's "Authorized JavaScript
// origins" in Google Cloud.

type Gis = {
  accounts: { id: { initialize: (o: { client_id: string; callback: (r: { credential: string }) => void; ux_mode?: string }) => void; renderButton: (el: HTMLElement, o: Record<string, unknown>) => void } };
};
declare global {
  interface Window {
    google?: Gis;
  }
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

export function GoogleButton({ onToken }: { onToken: (idToken: string) => void }) {
  const box = useRef<HTMLDivElement>(null);
  const [loadFailed, setFailed] = useState(false);
  const failed = loadFailed || !CLIENT_ID;
  useEffect(() => {
    if (!CLIENT_ID) return;
    const draw = () => {
      if (!window.google || !box.current) return;
      window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: (r) => onToken(r.credential) });
      window.google.accounts.id.renderButton(box.current, { theme: "outline", size: "large", text: "signin_with", shape: "rectangular", width: 280 });
    };
    if (window.google) return draw();
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = draw;
    s.onerror = () => setFailed(true);
    document.head.appendChild(s);
  }, [onToken]);
  return failed ? <p className="text-help">Google sign-in couldn&apos;t load. Check your connection and reload.</p> : <div ref={box} className="min-h-[44px]" />;
}
