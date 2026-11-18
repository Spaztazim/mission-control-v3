export type Theme = 'nostalgia' | 'reality';

export interface ThemeConfig {
  name: string;
  label: string;
  fontFamily: string;
  scanlines: boolean;
}

export const themes: Record<Theme, ThemeConfig> = {
  nostalgia: {
    name: 'nostalgia',
    label: 'Then',
    fontFamily: "Georgia, Palatino, serif",
    scanlines: false,
  },
  reality: {
    name: 'reality',
    label: 'Now',
    fontFamily: "'Courier New', 'Lucida Console', monospace",
    scanlines: true,
  },
};
