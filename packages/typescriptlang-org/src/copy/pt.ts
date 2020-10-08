import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "./en"
import { navCopy } from "./pt/nav"
import { docCopy } from "./pt/documentation"
import { indexCopy } from "./pt/index"
import { comCopy } from "./pt/community"
import { handbookCopy } from "./pt/handbook"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...docCopy,
  ...indexCopy,
  ...comCopy,
  ...handbookCopy,
})
