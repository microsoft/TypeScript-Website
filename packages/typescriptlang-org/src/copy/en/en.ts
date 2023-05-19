import { defineMessages } from "react-intl"
import { navCopy } from "./nav"
import { headCopy } from "./head-seo"
import { docCopy } from "./documentation"
import { indexCopy } from "./index"
import { indexCopy as index2Copy } from "./index2"
import { playCopy } from "./playground"
import { comCopy } from "./community"
import { handbookCopy } from "./handbook"
import { footerCopy } from "./footer"
import { cheatCopy } from "./cheatsheets"

export const messages = {
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...indexCopy,
  ...playCopy,
  ...comCopy,
  ...handbookCopy,
  ...index2Copy,
  ...footerCopy,
  ...cheatCopy
}

export const lang = defineMessages(messages)

export type Copy = typeof lang
