import { defineMessages } from "react-intl"
import { playCopy } from "./ja/playground"
import { Copy, messages as englishMessages } from "./en"
import { comCopy } from "./en/community"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...playCopy,
  ...comCopy,
})
