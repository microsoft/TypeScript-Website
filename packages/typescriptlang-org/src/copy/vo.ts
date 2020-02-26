import { defineMessages } from "react-intl"
import { navCopy } from "./vo/nav"
import { Copy, messages as englishMessages } from "./en"
import { comCopy } from "./en/community"

export const lang: Copy = defineMessages({
  ...navCopy,
  ...englishMessages,
  ...comCopy,
})
