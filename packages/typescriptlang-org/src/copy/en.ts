import { defineMessages } from "react-intl"
import { navCopy } from "./en/nav"
import { headCopy } from "./en/head-seo"
import { docCopy } from "./en/documentation"

export const lang = defineMessages({
  ...navCopy,
  ...docCopy,
  ...headCopy,
})

export type Copy = typeof lang
