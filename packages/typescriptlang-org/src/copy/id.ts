import { defineMessages } from "react-intl"
import { comCopy } from "./id/community"
import { docCopy } from "./id/documentation"
import { handbookCopy } from "./id/handbook"
import { headCopy } from "./id/head-seo"
import { indexCopy } from "./id/index"
import { navCopy } from "./id/nav"
import { playCopy } from "./id/playground"
import { Copy, messages as englishMessages } from "./en"

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
