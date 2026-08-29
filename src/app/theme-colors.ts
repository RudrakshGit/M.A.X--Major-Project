// The PWA manifest and the theme-color meta tag need literal values; neither can
// read a CSS variable. Defined once here so they cannot drift from the tokens in
// globals.css. Keep in sync with --color-surface and --color-ink.
export const themeColors = {
  surface: "#faf8f5",
  ink: "#2c2926",
} as const;
