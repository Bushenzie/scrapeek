import type { FC } from "react"
import ShikiHighligher from "react-shiki"
import type { CodeBlockProps } from "./code-block.types"

export const CodeBlock: FC<CodeBlockProps> = ({ code, lang, theme }) => {
  return (
    <ShikiHighligher
      language={lang}
      theme={theme ?? "github-dark"}
      className="rounded-none"
      showLanguage={false}
    >
      {code.trim()}
    </ShikiHighligher>
  )
}
