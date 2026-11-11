import type { NextConfig } from "next";

// The old MAX web app's pages now live in the MAX app (and its web version, "Try now"); old links still land
// somewhere useful.
const nextConfig: NextConfig = {
  async headers() {
    // the APK downloads as a file with Android's package type
    return [{ source: "/downloads/:file*.apk", headers: [{ key: "Content-Type", value: "application/vnd.android.package-archive" }, { key: "Content-Disposition", value: "attachment" }] }];
  },
  async redirects() {
    return [
      { source: "/referrals", destination: "/help", permanent: true },
      { source: "/campus", destination: "/college", permanent: true },
      { source: "/sign-in", destination: "/", permanent: false },
      { source: "/sign-up", destination: "/", permanent: false },
      ...["/journal", "/journeys/:path*", "/assessments/:path*", "/resources/:path*", "/settings", "/chat"].map((source) => ({ source, destination: "/try", permanent: false })),
    ];
  },
};

export default nextConfig;
