/**
 * CodeCanvas - Canonical Design Tokens
 * Source: @docs/handbook/studio.mdx
 */

export const brandColors = {
  identity: {
    oliveLeaf: "#8EA637", // Primary
    sproutGreen: "#C9F2AC", // Secondary
    deepForest: "#022601", // Tertiary
  },
  surface: {
    naturalFiber: "#F2E8C9", // Base Light
    coffeeSoil: "#400101", // Base Dark
    mintWhisper: "#F1F8E9", // Tint Light
    canopyDark: "#02590F", // Shade Dark
  },
  neutral: {
    rawLine: "#E6DCC3", // Border Light
    nightLine: "#2C1A1A", // Border Dark
    disabledGray: "#A89F91",
  },
  typography: {
    titles: {
      light: "#400101", // Used on light background
      dark: "#F2E8C9", // Used on dark background
    },
    subtitles: {
      light: "#5C4B3F",
      dark: "#C9F2AC",
    },
    paragraphs: {
      light: "#212121",
      dark: "#FBF8F1",
    },
    captions: {
      light: "#6D6D6D",
      dark: "#A89F91",
    },
  },
  feedback: {
    accent: "#F2622E", // Harvest Pumpkin (CTA)
    highlight: "#F2A341", // Sun Pollen
    success: "#2ECC71", // Emerald Fresh
    error: "#D9042B", // Clay Error
    warning: "#F2C84B", // Ripe Warning (Extended)
    info: "#2F80ED", // Water Info (Extended)
  },
} as const;

export type BrandColors = typeof brandColors;
