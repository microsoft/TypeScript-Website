import { defineMessages } from "react-intl"
import { playCopy } from "./zh/playground"
import { messages as chineseMessages } from "./zh"
import { navCopy } from "./zh/nav"
import { headCopy } from "./zh/head-seo"
import { docCopy } from "./zh/documentation"
import { indexCopy } from "./zh/index"
import { comCopy } from "./en/community"
import { handbookCopy } from './zh/handbook'

export const messages = {
  ...chineseMessages,
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...indexCopy,
  ...playCopy,
  ...comCopy,
  ...handbookCopy,
}

export const lang = defineMessages(messages)
