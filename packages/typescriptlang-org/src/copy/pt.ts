import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "./en"
import { docCopy } from "./pt/documentation"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...docCopy,
})
