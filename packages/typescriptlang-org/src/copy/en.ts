import { defineMessages } from "react-intl"
import { navCopy } from "./en/nav"
import { headCopy } from "./en/head-seo"
import { docCopy } from "./en/documentation"
import { indexCopy } from "./en/index"
import { playCopy } from "./en/playground"
import { comCopy } from "./en/community"
import { handbookCopy } from "./en/handbook"
import { dtCopy } from "./en/dt"

export const messages = {
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...indexCopy,
  ...playCopy,
  ...comCopy,
  ...handbookCopy,
  ...dtCopy,
}

export const lang = defineMessages(messages)

export type Copy = typeof lang
