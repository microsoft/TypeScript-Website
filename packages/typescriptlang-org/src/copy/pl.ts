import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "./en"
import { navCopy } from "./pl/nav"
import { indexCopy } from "./pl/index"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...indexCopy,
})
