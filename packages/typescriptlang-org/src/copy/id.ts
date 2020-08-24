import { defineMessages } from "react-intl"
import { comCopy } from "./id/community"
import { docCopy } from "./id/documentation"
import { navCopy } from "./id/nav"
import { Copy, messages as englishMessages } from "./en"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...comCopy,
  ...docCopy,
  ...navCopy,
})
