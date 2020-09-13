import { defineMessages } from "react-intl"
import { navCopy } from "./ja/nav"
import { playCopy } from "./ja/playground"
import { Copy, messages as englishMessages } from "./en"
import { comCopy } from "./en/community"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...playCopy,
  ...comCopy,
})
