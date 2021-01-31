import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "../en/en"
import { navCopy } from "./nav"
import { docCopy } from "./documentation"
import { indexCopy } from "./index"
import { comCopy } from "./community"
import { handbookCopy } from "./handbook"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...docCopy,
  ...indexCopy,
  ...comCopy,
  ...handbookCopy,
})
