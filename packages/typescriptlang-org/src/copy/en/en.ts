import { defineMessages } from "react-intl"
import { navCopy } from "./nav"
import { headCopy } from "./head-seo"
import { docCopy } from "./documentation"
import { indexCopy } from "./index"
import { playCopy } from "./playground"
import { comCopy } from "./community"
import { handbookCopy } from "./handbook"
import { dtCopy } from "./dt"

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
