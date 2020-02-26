import { defineMessages } from "react-intl"
import { navCopy } from "./en/nav"
import { headCopy } from "./en/head-seo"
import { docCopy } from "./en/documentation"
import { indexCopy } from "./en/index"
import { playCopy } from "./en/playground"
import { comCopy } from "./en/community"

export const messages = {
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...indexCopy,
  ...playCopy,
  ...comCopy,
}

export const lang = defineMessages(messages)

export type Copy = typeof lang
