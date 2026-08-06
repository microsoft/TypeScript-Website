import { documentationNavigation } from "./routes.mjs"

const englishHome = {
  headingHtml: "TypeScript is <strong>JavaScript with syntax for types.</strong>",
  byline: "TypeScript extends JavaScript by adding types.",
  summary: "TypeScript is a strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.",
  tryNow: "Try TypeScript Now",
  installCta: "Install TypeScript",
  whatIs: "What is TypeScript?",
  features: [
    {
      title: "JavaScript and More",
      bodyHtml: "TypeScript adds additional syntax to JavaScript to support a <strong>tighter integration with your editor</strong>. Catch errors early in your editor.",
    },
    {
      title: "A Result You Can Trust",
      bodyHtml: "TypeScript code converts to JavaScript, which <strong>runs anywhere JavaScript runs</strong>: in a browser, on Node.js, Deno, Bun, and in your apps.",
    },
    {
      title: "Safety at Scale",
      bodyHtml: "TypeScript understands JavaScript and uses <strong>type inference to give you great tooling</strong> without additional code.",
    },
  ],
  describeTitle: "Describe Your Data",
  describeBodyHtml: "<strong>Describe the shape of objects and functions</strong> in your code, making it possible to see <strong>documentation and issues in your editor</strong>.",
  startedCards: [
    { title: "Handbook", body: "Learn the language", href: "/docs/handbook/intro.html" },
    { title: "Install TypeScript", body: "Online or via npm", href: "/download" },
    { title: "Playground", body: "Try in your browser", href: "/play/" },
  ],
}

const homeByLocale = {
  en: englishHome,
  es: {
    ...englishHome,
    headingHtml: "TypeScript es <strong>JavaScript con sintaxis para tipos.</strong>",
    byline: "TypeScript extiende JavaScript agregando tipos.",
    summary: "TypeScript es un lenguaje de programacion fuertemente tipado que se basa en JavaScript y ofrece mejores herramientas a cualquier escala.",
    tryNow: "Prueba TypeScript ahora",
    whatIs: "Que es TypeScript?",
    startedCards: [
      { title: "Comienza un proyecto", body: "Encuentra una herramienta inicial", href: "/docs/" },
      { title: "Comunidad", body: "Mantente al dia", href: "/community" },
      { title: "Install TypeScript", body: "Online or via npm", href: "/download" },
    ],
  },
  fr: {
    ...englishHome,
    headingHtml: "TypeScript c'est <strong>JavaScript avec une syntaxe pour les types.</strong>",
    byline: "TypeScript ameliore JavaScript en ajoutant des types.",
    summary: "TypeScript est un langage de programmation fortement type qui s'appuie sur JavaScript et offre de meilleurs outils a n'importe quelle echelle.",
    tryNow: "Essayez TypeScript des maintenant",
    whatIs: "Qu'est-ce que TypeScript ?",
    features: [
      {
        title: "JavaScript et plus encore",
        bodyHtml: "TypeScript ajoute une syntaxe supplementaire a JavaScript pour favoriser une <strong>integration plus poussee avec votre editeur</strong>. Detectez les erreurs au plus tot dans votre editeur.",
      },
      {
        title: "Un resultat digne de confiance",
        bodyHtml: "Le code TypeScript peut etre converti en JavaScript, qui <strong>peut etre execute n'importe ou ou fonctionne JavaScript</strong> : dans un navigateur, sur Node.js ou Deno et dans vos applications.",
      },
      {
        title: "La securite a l'echelle",
        bodyHtml: "TypeScript comprend le JavaScript et utilise <strong>l'inference de type pour vous donner des outils de qualite</strong> sans code supplementaire.",
      },
    ],
    describeTitle: "Decrivez vos donnees",
    describeBodyHtml: "<strong>Decrivez la forme des objets et des fonctions</strong> dans votre code, permettant de voir la <strong>documentation et les problemes dans votre editeur</strong>.",
    startedCards: [
      { title: "Guide", body: "Apprendre le langage", href: "/docs/handbook/intro.html" },
      { title: "Installer TypeScript", body: "En ligne ou via npm", href: "/download" },
      { title: "Playground", body: "Essayer dans votre navigateur", href: "/play/" },
    ],
  },
  id: {
    ...englishHome,
    byline: "TypeScript memperluas JavaScript dengan menambahkan tipe.",
    tryNow: "Coba TypeScript sekarang",
    startedCards: [
      { title: "Mulai projek", body: "Temukan alat bootstrap", href: "/docs/" },
      { title: "Komunitas", body: "Tetap terbaru", href: "/community" },
      { title: "Unduh", body: "Install TypeScript", href: "/download" },
    ],
  },
  ja: {
    ...englishHome,
    headingHtml: "TypeScript は <strong>型の構文を持つ JavaScript</strong> です。",
    byline: "TypeScript は JavaScript に型を追加して拡張します。",
    summary: "TypeScript は JavaScript を基盤とした厳密に型付けされたプログラミング言語で、あらゆる規模で優れたツールを提供します。",
    tryNow: "TypeScript を試す",
    whatIs: "TypeScript とは？",
  },
  ko: {
    ...englishHome,
    headingHtml: "TypeScript는 <strong>타입 구문이 있는 JavaScript</strong>입니다.",
    byline: "TypeScript는 타입을 추가하여 JavaScript를 확장합니다.",
    summary: "TypeScript는 JavaScript를 기반으로 더 나은 도구를 제공하는 강력한 형식의 프로그래밍 언어입니다.",
    tryNow: "TypeScript 사용해 보기",
    whatIs: "TypeScript란?",
  },
  pl: {
    ...englishHome,
    startedCards: [
      { title: "Zacznij projekt", body: "Znajdz swoje narzedzia", href: "/docs/" },
      { title: "Spolecznosc", body: "Badz na biezaco", href: "/community" },
      { title: "Pobierz", body: "Install TypeScript", href: "/download" },
    ],
  },
  pt: {
    ...englishHome,
    headingHtml: "TypeScript e <strong>JavaScript com sintaxe para tipos.</strong>",
    byline: "TypeScript estende JavaScript adicionando tipos.",
    summary: "TypeScript e uma linguagem fortemente tipada baseada em JavaScript, oferecendo melhores ferramentas em qualquer escala.",
    tryNow: "Experimente TypeScript",
    whatIs: "O que e TypeScript?",
  },
  vo: englishHome,
  zh: {
    ...englishHome,
    headingHtml: "TypeScript 是<strong>具有类型语法的 JavaScript</strong>。",
    byline: "TypeScript 通过添加类型扩展 JavaScript。",
    summary: "TypeScript 是构建在 JavaScript 之上的强类型编程语言，可在任何规模下提供更好的工具。",
    tryNow: "立即试用 TypeScript",
    whatIs: "什么是 TypeScript？",
    startedCards: [
      { title: "开始一个项目", body: "寻找一个入手点", href: "/docs/" },
      { title: "社区", body: "不断更新", href: "/community" },
      { title: "下载", body: "Install TypeScript", href: "/download" },
    ],
  },
}

const communityByLocale = {
  en: {
    title: "TypeScript Community Resources",
    description: "Connect with other TypeScripters online and offline.",
    headline: "Connect with us",
    sectionIntro: "Tell us what's working well, what you want to see added or improved, and find out about new updates.",
    cards: [
      ["Stack Overflow", "Engage with your peers and ask questions about TypeScript using the tag 'typescript'", "https://stackoverflow.com/questions/tagged/typescript"],
      ["Chat", "Chat with other TypeScript users in the TypeScript Community Chat.", "https://discord.gg/typescript"],
      ["GitHub", "Found a bug, or want to give us constructive feedback? Tell us on GitHub.", "https://github.com/microsoft/TypeScript/issues/new/choose"],
      ["Twitter", "Stay up to date. Follow us on Twitter @typescript.", "https://twitter.com/typescript"],
      ["Blog", "Learn about the latest TypeScript developments via our blog.", "https://devblogs.microsoft.com/typescript/"],
      ["Definitely Typed", "Browse the thousands of TypeScript definition files available for common libraries and frameworks.", "https://github.com/DefinitelyTyped/DefinitelyTyped/#definitelytyped"],
    ],
  },
  id: {
    title: "Bagaimana cara mempersiapkan TypeScript",
    description: "Terhubung dengan pengguna TypeScript secara daring dan luring.",
    headline: "Terhubung dengan kami",
    sectionIntro: "Beri tahu kami apa yang bekerja dengan baik, apa yang ingin Anda tambahkan atau tingkatkan, dan cari tahu mengenai pembaruan terbaru.",
    cards: [
      ["Stack Overflow", "Ajak teman Anda dan ajukan pertanyaan mengenai TypeScript menggunakan tanda pagar 'typescript'", "https://stackoverflow.com/questions/tagged/typescript"],
      ["Obrolan", "Mengobrol dengan pengguna TypeScript lainnya pada Obrolan Komunitas TypeScript.", "https://discord.gg/typescript"],
      ["GitHub", "Menemukan bug atau ingin memberikan umpan balik yang membangun? Beritahu kami di GitHub.", "https://github.com/microsoft/TypeScript/issues/new/choose"],
      ["Twitter", "Tetap terkini. Ikuti kami di Twitter.", "https://twitter.com/typescript"],
      ["Blog", "Pelajari mengenai perkembangan TypeScript terbaru melalui blog kami.", "https://devblogs.microsoft.com/typescript/"],
      ["Definitely Typed", "Cari ribuan berkas definisi TypeScript yang tersedia untuk perpustakaan dan kerangka kerja umum.", "https://github.com/DefinitelyTyped/DefinitelyTyped/#definitelytyped"],
    ],
  },
  ja: {
    title: "TypeScript のセットアップ方法",
    description: "TypeScriptユーザーとオンライン、オフラインでつながる",
    headline: "Connect with us",
    sectionIntro: "うまくいっていること、新機能や改善点を私たちに教えてください。そして、新しいアップデートを見つけましょう。",
    cards: [
      ["Stack Overflow", "「typescript」タグを使って仲間とつながったり、TypeScriptについての質問をしましょう。", "https://stackoverflow.com/questions/tagged/typescript"],
      ["チャット", "TypeScriptコミュニティのチャットで、他のTypeScriptユーザーとやり取りをしましょう。", "https://discord.gg/typescript"],
      ["GitHub", "バグや、フィードバックの報告は GitHub で伝えましょう。", "https://github.com/microsoft/TypeScript/issues/new/choose"],
      ["Twitter", "最新情報はTwitterでフォローしてください。", "https://twitter.com/typescript"],
      ["Blog", "最新のTypeScriptの開発状況はブログで確認できます。", "https://devblogs.microsoft.com/typescript/"],
      ["Definitely Typed", "多くのライブラリやフレームワークの型定義を利用できます。", "https://github.com/DefinitelyTyped/DefinitelyTyped/#definitelytyped"],
    ],
  },
  zh: {
    title: "如何配置 TypeScript",
    description: "在线上或线下与其他 TypeScript 使用者交流",
    headline: "联系我们",
    sectionIntro: "让我们知道什么地方做得好，什么地方可以做得更好，并了解最新进展。",
    cards: [
      ["Stack Overflow", "与您的同路人互动，并使用 'typescript' 标签询问有关 TypeScript 的问题。", "https://stackoverflow.com/questions/tagged/typescript"],
      ["交流", "在 TypeScript 社区聊天室中与其他 TypeScript 用户聊天。", "https://discord.gg/typescript"],
      ["GitHub", "找到了 bug，或者有你独到的见解？在 GitHub 上告诉我们。", "https://github.com/microsoft/TypeScript/issues/new/choose"],
      ["Twitter", "跟进最新进展。在 Twitter 上关注我们。", "https://twitter.com/typescript"],
      ["Blog", "了解最新的 TypeScript 进展，请阅读我们的博客。", "https://devblogs.microsoft.com/typescript/"],
      ["Definitely Typed", "浏览数千个可用的通用库和框架的 TypeScript 定义文件。", "https://github.com/DefinitelyTyped/DefinitelyTyped/#definitelytyped"],
    ],
  },
}

const docsByLocale = {
  en: ["The starting point for learning TypeScript", "Find TypeScript starter projects: from Angular to React or Node.js and CLIs.", "Handbook", "The TypeScript language reference"],
  es: ["El punto de partida para aprender TypeScript", "Encuentra proyectos iniciales de TypeScript: desde Angular hasta React o Node.js y CLIs.", "Manual", "La referencia al lenguaje de TypeScript"],
  fr: ["Le point de depart pour apprendre TypeScript", "Trouvez des projets de demarrage TypeScript : d'Angular a React ou Node.js et CLI.", "Manuel", "La documentation du langage TypeScript"],
  id: ["Permulaan untuk belajar TypeScript", "Cari awalan proyek yang menggunakan TypeScript: dari Angular ke React atau Node.js dan CLI.", "Handbook", "Referensi bahasa TypeScript"],
  ja: ["TypeScript学習の第一歩", "TypeScriptスタータープロジェクトを見つけましょう: AngularからReact、Node.js、そしてCLIまで", "Handbook", "The TypeScript language reference"],
  zh: ["学习 TypeScript 的起点", "找到针对 TypeScript 的入门项目：Angular、React 或者 Node.js 与 CLI。", "手册", "TypeScript 语言参考"],
}

const typedSearchByLocale = {
  en: ["Search for typed packages", "This page is no longer necessary."],
  fr: ["Rechercher des paquets types", "Trouvez des paquets npm qui ont des declarations de types, soit integres ou sur Definitely Typed."],
  id: ["Cari paket yang mempunyai tipe data", "Cari paket npm yang mempunyai deklarasi tipe data, yang jadi satu maupun di Definitely Typed."],
  pl: ["Szukaj typowanych pakietow", "Znajdz pakiety npm, ktore maja deklaracje typu w pakiecie lub sa Definitely Typed."],
  pt: ["Procure por pacotes tipados", "Encontre pacotes npm que tenham declaracoes de tipo, tanto agrupados quanto no Definitely Typed."],
}

export function getHomePageContent(locale) {
  return homeByLocale[locale] || englishHome
}

export function getRootPageData({ pathname, locale, title, routes }) {
  const localizedPrefix = locale === "en" ? /^\/?/ : new RegExp(`^/?${locale}(?:/|$)`)
  const localPath = pathname.replace(localizedPrefix, "").replace(/^\/+|\/+$/g, "")
  const docsCopy = docsByLocale[locale] || docsByLocale.en
  const docsGroups = documentationNavigation(routes, locale, pathname).filter(group => group.items.length)

  if (localPath === "") return { kind: "home", ...getHomePageContent(locale) }
  if (localPath === "empty") return { kind: "empty", heading: "NO-OP", intro: "This page is intentionally left empty." }
  if (localPath === "community") return { kind: "community", ...(communityByLocale[locale] || communityByLocale.en) }
  if (localPath === "cheatsheets") return { kind: "cheatsheets", heading: "TypeScript Cheat Sheets", intro: "Downloadable syntax reference pages for different parts of everyday TypeScript code", detail: "Learn more about Classes, Interfaces, Types and Control Flow Analysis", downloadLabel: "Download Zip", downloadTitle: "Download PDFs and PNGs", downloadSubtitle: "To read later or print", sheets: ["Control Flow Analysis", "Interfaces", "Types", "Classes"] }
  if (localPath === "download") return { kind: "download", heading: "Download TypeScript", intro: "TypeScript can be installed through three installation routes depending on how you intend to use it: an npm module, a NuGet package, or a Visual Studio extension.", lead: "If you are using Node.js, you want the npm version. If you are using MSBuild in your project, you want the NuGet package or Visual Studio extension." }
  if (localPath === "tools") return { kind: "tools", heading: "Reference Tools", intro: "Online tooling to help you understand TypeScript", cards: [["Playground", "A live environment for exploring, learning, and sharing TypeScript code. Try different compiler flags and walk through sample programs.", "/play/"], ["TSConfig Reference", "An annotated reference to more than a hundred compiler options available in a tsconfig.json or jsconfig.json.", "/tsconfig"], ["Cheat Sheets", "Quickly look up the syntax for common TypeScript code.", "/cheatsheets"]] }
  if (localPath === "why-create-typescript") return { kind: "why", heading: "Why does TypeScript exist?", intro: "TypeScript is a language from Microsoft which builds on JavaScript. This page is a non-technical overview of what JavaScript is, how TypeScript extends JavaScript, and what problems it solves." }
  if (localPath === "dt/search") {
    const [pageTitle, subtitle] = typedSearchByLocale[locale] || typedSearchByLocale.en
    return { kind: "dt", title: pageTitle, subtitle, body: "The npm and Yarn package registries now include type information for packages.", linkLabel: "npm displays packages with bundled TypeScript declarations" }
  }
  if (localPath === "docs") return { kind: "docs", heading: docsCopy[0], intro: docsCopy[1], groups: docsGroups }
  if (localPath === "docs/handbook") return { kind: "docs", heading: docsCopy[2], intro: docsCopy[3], groups: docsGroups }
  return { kind: "generic", heading: title, intro: "TypeScript documentation and resources." }
}