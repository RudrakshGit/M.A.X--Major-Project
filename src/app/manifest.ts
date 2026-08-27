import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MAX - Mental Health Support",
    short_name: "MAX",
    description: "A digital mental health and psychological support system for students in higher education.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#1A1A1A",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
