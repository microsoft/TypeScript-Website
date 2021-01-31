import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "../en/en"
import { navCopy } from "./nav"
import { indexCopy } from "./index"
import { handbookCopy } from "./handbook"
import { dtCopy } from "./dt"
import { headCopy } from "./head-seo"
import { playCopy } from "./playground"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...indexCopy,
  ...handbookCopy,
  ...dtCopy,
  ...headCopy,
  ...playCopy,
})
