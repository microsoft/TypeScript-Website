import { defineMessages } from "react-intl"
import { navCopy } from "./ja/nav"
import { docCopy } from "./ja/documentation"
import { headCopy } from "./ja/head-seo"
import { playCopy } from "./ja/playground"
import { comCopy } from "./ja/community"
import { Copy, messages as englishMessages } from "./en"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...playCopy,
  ...comCopy,
})
