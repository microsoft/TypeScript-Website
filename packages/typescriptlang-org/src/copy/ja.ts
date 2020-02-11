import { defineMessages } from "react-intl"
import { playCopy } from "./ja/playground"
import { Copy, messages as englishMessages } from "./en"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...playCopy,
})
