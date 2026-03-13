export type Theme = 'nostalgia' | 'reality';

export interface ThemeConfig {
  name: string;
  label: string;
  bg: string;
  bgGradient: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textMuted: string;
  particleColor: string;
  particleGlow: string;
  scanlines: boolean;
  fontFamily: string;
}

export const themes: Record<Theme, ThemeConfig> = {
  nostalgia: {
    name: 'nostalgia',
    label: 'Then',
    bg: '#0a0f05',
    bgGradient: 'linear-gradient(180deg, #050a02 0%, #0d1a08 40%, #0a1505 100%)',
    primary: '#f5a623',
    secondary: '#e8d5a3',
    accent: '#7bc67e',
    text: '#f0e6c8',
    textMuted: '#a09070',
    particleColor: '#f5d76e',
    particleGlow: '#f5a623',
    scanlines: false,
    fontFamily: "'Georgia', 'Palatino', serif",
  },
  reality: {
    name: 'reality',
    label: 'Now',
    bg: '#030308',
    bgGradient: 'linear-gradient(180deg, #020205 0%, #050515 40%, #030310 100%)',
    primary: '#00f5ff',
    secondary: '#ff0090',
    accent: '#ffaa00',
    text: '#e0f0ff',
    textMuted: '#4080a0',
    particleColor: '#00f5ff',
    particleGlow: '#ff0090',
    scanlines: true,
    fontFamily: "'Courier New', 'Lucida Console', monospace",
  },
};
