import { themeColors } from "./theme-colors";
import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "M.A.X — Mental-health Assistance & eXpert",
    short_name: "M.A.X",
    description: "A digital mental health and psychological support system for students in higher education.",
    start_url: "/",
    display: "standalone",
    background_color: themeColors.surface,
    theme_color: themeColors.ink,
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
