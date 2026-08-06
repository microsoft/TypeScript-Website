import { getRootPageData } from "./root-pages.mjs"

const defaultDescription = "TypeScript is JavaScript with syntax for types."
const playgroundCopy = {
  en: ["The Playground lets you write TypeScript or JavaScript online in a safe and sharable way.", "TS Playground - An online editor for exploring TypeScript and JavaScript", "Playground Example"],
  es: ["El editor te permite escribir código TypeScript o JavaScript en linea de manera segura y compartida.", "Playground - Un editor en linea para explorar TypeScript y JavaScript", "Playground Example"],
  fr: ["Le playground vous permet d'écrire du TypeScript ou du JavaScript en ligne de manière sûre et partageable.", "Playground TS - Un éditeur en ligne pour explorer TypeScript et JavaScript", "Playground Exemple"],
  id: ["Area Bermain membuat Anda bisa menulis TypeScript atau JavaScript secara daring dengan aman dan bisa dibagikan.", "Area Bermain - Sebuah editor daring untuk menjelajahi TypeScript dan JavaScript", "Contoh Area Bermain"],
  ja: ["プレイグラウンドで、TypeScriptとJavascriptのコードをオンラインで安全に共有できる形で書くことができます", "プレイグラウンド - TypeScriptとJavascriptを探求するためのオンラインエディタ", "プレイグラウンド 例"],
  zh: ["可以通过演练场以安全且可共享的方式在线编写 TypeScript 和 JavaScript。", "演练场 - 一个用于 TypeScript 和 JavaScript 的在线编辑器", "演练场示例"],
}

const tsconfigCopy = {
  en: ["From allowJs to useDefineForClassFields the TSConfig reference includes information about all of the active compiler flags setting up a TypeScript project.", "TSConfig Reference - Docs on every TSConfig option"],
  es: ["Desde la opción allowJs a useDefineForClassFields, las referencias de TSConfig incluyen información sobre todas las configuraciones activas del compilador en un proyecto TypeScript.", "Referencia TSConfig - Documentación sobre todas las opciones de configuración en TSConfig"],
  fr: ["De allowJs à useDefineForClassFields, la référence TSConfig documente les différents options du compilateur qui permettent de configurer un projet TypeScript.", "Référence TSConfig - documentation sur toutes les options du fichier TSConfig"],
  id: ["Dari allowJs hingga useDefineForClassFields referensi TSConfig meliputi informasi tentang semua tanda kompiler yang aktif untuk mengatur projek TypeScript.", "Referensi TSConfig - Dokumentasi bagi setiap opsi TSConfig"],
  ja: ["allowJs から useDefineForClassFields まで、TSConfigのドキュメントは、TypeScriptプロジェクトで設定可能なコンパイラオプションのすべてを含んでいます", "TSConfig リファレンス - すべてのTSConfigのオプションのドキュメント"],
  zh: ["不管是 allowJs 还是 useDefineForClassFields， TSConfig 的参考包含所有关于配置项目的有效的 TypeScript 编译器选项。", "TSConfig 参考 - 所有 TSConfig 选项的文档"],
}

const developerCopy = {
  branding: ["Logos and design assets", "Branding"],
  "dev/bug-workbench": ["Create reproductions of issues with TypeScript", "Bug Workbench"],
  "dev/playground-plugins": ["What is a TypeScript Playground Plugin, and how can you make one?", "Developers - Playground Plugins"],
  "dev/sandbox": ["The TypeScript sandbox powers the TypeScript Playground. Learn how you can make your experiences like the playground using the sandbox.", "Developers - Sandbox"],
  "dev/twoslash": ["Learn about the TypeScript code sample library twoslash. Used for transpiling, providing hover to identifiers and compiler-driven error states.", "Developers - Twoslash Code Samples"],
  "dev/typescript-vfs": ["Run TypeScript in the browser, or anywhere - using a virtual file-system", "Developers - TypeScript VFS"],
}

const rootCommunityCopy = {
  en: ["Connect with other TypeScripters online and offline.", "TypeScript Community Resources"],
  es: ["com_layout_description", "Como configurar TypeScript"],
  fr: ["Échangez avec d'autres TypeScripters en ligne et hors ligne.", "Ressources communautaires TypeScript"],
  id: ["Terhubung dengan pengguna TypeScript secara daring dan luring.", "Bagaimana cara mempersiapkan TypeScript"],
  ja: ["TypeScriptユーザーとオンライン、オフラインでつながる", "TypeScript のセットアップ方法"],
  ko: ["https://www.typescriptlang.org/ko/community 에 표시될 문자열들", "TypeScript 커뮤니티 페이지"],
  pl: ["Connect with other TypeScripters online and offline.", "TypeScript Community Resources"],
  pt: ["Conecte-se com outros do mundo TypeScript online e offline.", "Como configurar TypeScript"],
  vo: ["Connect with other TypeScripters online and offline.", "TypeScript Community Resources"],
  zh: ["在线上或线下与其他 Typescript 使用者交流", "如何配置 TypeScript"],
}

const rootDocsCopy = {
  en: ["Find TypeScript starter projects: from Angular to React or Node.js and CLIs.", "The starting point for learning TypeScript"],
  es: ["Encuentra proyectos iniciales de TypeScript: desde Angular hasta React o Node.js y CLIs.", "El punto de partida para aprender TypeScript"],
  fr: ["Trouvez des projets de démarrage TypeScript : d'Angular à React ou Node.js et CLI.", "Le point de départ pour apprendre TypeScript"],
  id: ["Cari awalan proyek yang menggunakan TypeScript: dari Angular ke React atau Node.js dan CLI.", "Permulaan untuk belajar TypeScript"],
  ja: ["TypeScriptスタータープロジェクトを見つけましょう: AngularからReact、Node.js、そしてCLIまで", "TypeScript学習の第一歩"],
  ko: ["Find TypeScript starter projects: from Angular to React or Node.js and CLIs.", "The starting point for learning TypeScript"],
  pl: ["Find TypeScript starter projects: from Angular to React or Node.js and CLIs.", "The starting point for learning TypeScript"],
  pt: ["Encontre projetos para começar com Typescript: de Angular a React ou Node.js e CLIs.", "O ponto inicial para aprender Typescript"],
  vo: ["Find TypeScript starter projects: from Angular to React or Node.js and CLIs.", "The starting point for learning TypeScript"],
  zh: ["找到针对 TypeScript 的入门项目：Angular、React 或者 Node.js 与 CLI。", "学习 TypeScript 的起点"],
}

const handbookV1Routes = new Set([
  "docs/handbook/basic-types.html", "docs/handbook/classes.html", "docs/handbook/enums.html",
  "docs/handbook/functions.html", "docs/handbook/generics.html", "docs/handbook/interfaces.html",
  "docs/handbook/intro.html", "docs/handbook/literal-types.html", "docs/handbook/unions-and-intersections.html",
  "fr/docs/handbook/intro.html", "ko/docs/handbook/enums.html", "ko/docs/handbook/intro.html",
])

export function getRouteMetadata(page, routes = []) {
  const fallback = { description: page.description || defaultDescription, ogTitle: page.title }

  if (page.family === "documentation") return {
    description: page.frontmatter?.oneline || fallback.description,
    ogTitle: `${handbookV1Routes.has(page.pathname) ? "Handbook" : "Documentation"} - ${page.title}`,
  }

  if (page.family === "playground" || page.family === "playground-example") {
    const [description, playgroundTitle, examplePrefix] = playgroundCopy[page.locale] || playgroundCopy.en
    return { description, ogTitle: page.family === "playground" ? playgroundTitle : `${examplePrefix} - ${page.title}` }
  }

  if (page.family === "tsconfig") {
    const [description, ogTitle] = tsconfigCopy[page.locale] || tsconfigCopy.en
    return { description, ogTitle }
  }

  if (page.family === "tsconfig-option") return { description: "How this setting affects your build.", ogTitle: `TSConfig Option: ${page.title}` }
  if (page.family === "glossary") return { description: tsconfigCopy.en[0], ogTitle: tsconfigCopy.en[1] }

  if (page.family === "developer") {
    const [description, ogTitle] = developerCopy[page.pathname]
    return { description, ogTitle }
  }

  if (page.family === "root") {
    const data = getRootPageData({ pathname: page.pathname, locale: page.locale, title: page.title, routes })
    const localPath = page.pathname.replace(new RegExp(`^${page.locale === "en" ? "$^" : `${page.locale}/`}`), "")
    if (data.kind === "home") return {
      description: "TypeScript extends JavaScript by adding types to the language. TypeScript speeds up your development experience by catching errors and providing fixes before you even run your code.",
      ogTitle: "JavaScript With Syntax For Types.",
    }
    if (data.kind === "community") {
      const [description, ogTitle] = rootCommunityCopy[page.locale] || rootCommunityCopy.en
      return { description, ogTitle }
    }
    if (data.kind === "docs") {
      const [description, ogTitle] = rootDocsCopy[page.locale] || rootDocsCopy.en
      return { description, ogTitle }
    }
    if (data.kind === "dt") return { description: "This page is no longer necessary.", ogTitle: "Search for typed packages" }
    const rootMetadata = {
      cheatsheets: [page.locale === "fr" ? "A lire plus tard ou à imprimer" : "To read later or print", page.locale === "fr" ? "Cheat sheets" : "Cheat Sheets"],
      download: ["Add TypeScript to your project, or install TypeScript globally", "How to set up TypeScript"],
      empty: ["This page is intentionally left empty", "NO-OP"],
      tools: ["Online tooling to help you understand TypeScript", "Reference Tools"],
      "why-create-typescript": [data.intro || defaultDescription, "Why does TypeScript exist?"],
    }
    const metadata = rootMetadata[localPath]
    if (metadata) return { description: metadata[0], ogTitle: metadata[1] }
  }

  return fallback
}