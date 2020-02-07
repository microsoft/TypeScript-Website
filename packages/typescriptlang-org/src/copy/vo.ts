import { defineMessages } from "react-intl"
import { navCopy } from "./vo/nav"
import { Copy, messages as englishMessages } from "./en"

export const lang: Copy = defineMessages({
  ...navCopy,
  ...englishMessages,
})
