import { defineMessages } from "react-intl"
import { navCopy } from "./nav"
import { docCopy } from "./documentation"
import { headCopy } from "./head-seo"
import { playCopy } from "./playground"
import { comCopy } from "./community"
import { Copy, messages as englishMessages } from "../en/en"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...playCopy,
  ...comCopy,
})
