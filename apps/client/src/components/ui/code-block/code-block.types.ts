import type { Language, Theme } from "react-shiki";

export type CodeBlockProps = {
  code: string;
  lang: Language;
  theme?: Theme;
};
