import type { MetadataRoute } from "next";
import { themeColors } from "./theme-colors";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MAX, a wellbeing companion for students",
    short_name: "MAX",
    description: "A free, private wellbeing companion for college students in India.",
    start_url: "/",
    display: "standalone",
    background_color: themeColors.paper,
    theme_color: themeColors.paper,
    icons: [{ src: "/max.png", sizes: "400x400", type: "image/png" }],
  };
}
