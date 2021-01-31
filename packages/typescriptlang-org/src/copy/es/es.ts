import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "../en/en"
import { navCopy } from "./nav"
import { headCopy } from "./head-seo"

import { docCopy } from "./documentation"
import { indexCopy } from "./index"

import { playCopy } from "./playground"
import { comCopy } from "./community"
import { handbookCopy } from "../en/handbook"

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
