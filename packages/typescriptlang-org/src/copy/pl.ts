import { defineMessages } from "react-intl"
import { Copy, messages as englishMessages } from "./en"
import { navCopy } from "./pl/nav"
import { indexCopy } from "./pl/index"
import { handbookCopy } from "./pl/handbook"
import { dtCopy } from "./pl/dt"
import { headCopy } from "./pl/head-seo"
import { playCopy } from "./pl/playground"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...indexCopy,
  ...handbookCopy,
  ...dtCopy,
  ...headCopy,
  ...playCopy,
})
