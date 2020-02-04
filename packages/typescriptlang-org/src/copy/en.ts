import { defineMessages } from "react-intl"
import { navCopy } from "./en/nav"
import { headCopy } from "./en/head-seo"
import { docCopy } from "./en/documentation"
import { indexCopy } from "./en/index"

export const messages = {
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...indexCopy,
}

export const lang = defineMessages(messages)

export type Copy = typeof lang
