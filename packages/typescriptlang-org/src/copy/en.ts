import { defineMessages } from "react-intl"
import { navCopy } from "./en/nav"
import { docCopy } from "./en/documentation"

export const lang = defineMessages({
  ...navCopy,
  ...docCopy,
})

export type Copy = typeof lang
