import { defineMessages } from "react-intl"
import { comCopy } from "./community"
import { docCopy } from "./documentation"
import { handbookCopy } from "./handbook"
import { headCopy } from "./head-seo"
import { indexCopy } from "./index"
import { navCopy } from "./nav"
import { playCopy } from "./playground"
import { Copy, messages as englishMessages } from "../en/en"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...comCopy,
  ...docCopy,
  ...handbookCopy,
  ...headCopy,
  ...indexCopy,
  ...navCopy,
  ...playCopy,
})
