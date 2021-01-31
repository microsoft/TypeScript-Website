import { defineMessages } from "react-intl"
import { navCopy } from "./nav"
import { Copy, messages as englishMessages } from "../en/en"
import { comCopy } from "../en/community"

export const lang: Copy = defineMessages({
  ...navCopy,
  ...englishMessages,
  ...comCopy,
})
