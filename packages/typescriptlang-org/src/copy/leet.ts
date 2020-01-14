import { defineMessages } from "react-intl"
import { navCopy } from "./leet/nav"
import { docCopy } from "./en/documentation"
import { Copy } from "./en"

export const lang: Copy = defineMessages({
  ...navCopy,
  ...docCopy,
})
