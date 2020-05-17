import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "./en"
import { navCopy } from "./es/nav"
import { headCopy } from "./es/head-seo"
import { docCopy } from "./es/documentation"
import { indexCopy } from "./en/index"
import { playCopy } from "./es/playground"
import { comCopy } from "./es/community"
import { handbookCopy } from "./en/handbook"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...indexCopy,
  ...playCopy,
  ...comCopy,
  ...handbookCopy,
})
