export interface Memory {
  id: number;
  title: string;
  date: string;
  image: string;
  story: string;
  chapter?: number;
}

export interface BackgroundTheme {
  name: string;
  primary: string;
  cardBg: string;
  text: string;
  accent: string;
}

// Theme System
export type ThemeStyle = 'perplexity' | 'neobrutalism' | 'gradientWave' | 'parallax' | 'minimal' | 'stageLights';
export type CarouselStyle = 'orbit' | 'timeline' | 'stack' | 'stories' | 'flow';
export type CardStyle = 'borderless' | 'polaroid';

export interface ThemeConfig {
  id: ThemeStyle;
  name: string;
  description: string;
  background: {
    type: 'gradient' | 'animated' | 'solid';
    value: string;
    overlay?: string;
    blur?: boolean;
    noise?: boolean;
  };
  card: {
    background: string;
    border: string;
    shadow: string;
    borderRadius: string;
  };
  typography: {
    fontFamily: string;
    titleColor: string;
    textColor: string;
    accentColor: string;
    textStroke?: string;
    textShadow?: string;
    filter?: string;
  };
}

export interface CarouselConfig {
  type: CarouselStyle;
  loop: boolean;
  autoPlay: boolean;
  autoPlayDuration: number;
  showProgress: boolean;
  showNavigation: boolean;
}

export interface StoryConfig {
  theme: ThemeStyle;
  carousel: CarouselStyle;
  autoPlay: boolean;
  autoPlayDuration: number;
}