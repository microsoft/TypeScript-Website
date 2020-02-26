import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "./en"
import { navCopy } from "./es/nav"
import { headCopy } from "./es/head-seo"
import { docCopy } from "./en/documentation"
import { indexCopy } from "./en/index"
import { playCopy } from "./es/playground"
import { comCopy } from "./en/community"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...indexCopy,
  ...playCopy,
  ...comCopy,
})
