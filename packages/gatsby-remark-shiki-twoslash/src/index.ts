// prettier-ignore
import type { UserConfigSettings } from "shiki-twoslash"
import remarkShikiTwoslash from "remark-shiki-twoslash"
import visit from "unist-util-visit"

/** Sends the twoslash visitor over the existing MD AST and replaces the code samples inline, does not do highlighting  */
export const runTwoSlashAcrossDocument = ({ markdownAST }: any, settings: UserConfigSettings = {}) =>
  visit(markdownAST, "code", remarkShikiTwoslash(settings))

export default remarkShikiTwoslash
