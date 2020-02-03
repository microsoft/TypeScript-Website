import { defineMessages } from "react-intl"
import { navCopy } from "./vo/nav"
import { docCopy } from "./en/documentation"
import { headCopy } from "./en/head-seo"
import { Copy } from "./en"

export const lang: Copy = defineMessages({
  ...navCopy,
  ...docCopy,
  ...headCopy,
})
