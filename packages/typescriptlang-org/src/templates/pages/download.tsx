import * as React from "react"
import { Intl } from "../../components/Intl"
import { createIntlLink } from "../../components/IntlLink"
import { Layout } from "../../components/layout"
import { QuickJump } from "../../components/QuickJump"
import releaseInfo from "../../lib/release-info.json"


type Props = {
  pageContext: any
  b: NewableFunction
}

const changeExample = (code: string) => document.getElementById("code-example")!.textContent = code
const changeExample2 = (code: string) => document.getElementById("code-run")!.textContent = code

const Index: React.FC<Props> = (props) => {
  const Link = createIntlLink(props.pageContext.lang)

  return <Layout title="如何设置 TypeScript" description="将 TypeScript 添加到你的项目中，或者全局安装 TypeScript" lang={props.pageContext.lang}>
    <div className="raised main-content-block">
      <h1>下载 TypeScript</h1>
      <p>根据你打算如何使用 TypeScript，可以通过三种安装方式进行安装：npm 模块、NuGet 包或 Visual Studio 扩展。</p>
      <p>如果你正在使用 Node.js，你需要选择 npm 版本。如果你的项目使用 MSBuild，则需要选择 NuGet 包或 Visual Studio 扩展。</p>
    </div>

    <div className="raised main-content-block">
      <h2>在你的项目中使用 TypeScript</h2>
      <p>在每个项目中依次设置 TypeScript 可以让你的每个项目都可以使用不同版本的 TypeScript，这样可以保持每个项目的一致性。</p>

      <section style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>通过 npm 安装</h3>
          <p>TypeScript 可以作为<a href="https://www.npmjs.com/package/typescript"> npm 注册表上的包</a>，名称为<code>“typescript”</code>。</p>
          <p>你需要 <a title="链接到 node.js 项目" href="https://nodejs.org/en/">Node.js</a> 作为运行该包的环境。然后，你可以使用像 <a title="链接到 npm 包管理器" href='https://www.npmjs.com/'>npm</a>、<a title="链接到 yarn 包管理器" href='https://yarnpkg.com/'>yarn</a> 或 <a title="链接到 pnpm 包管理器" href='https://pnpm.js.org/'>pnpm</a> 这样的依赖管理器将 TypeScript 下载到你的项目中。</p>
          <div>
            <code id='code-example'>npm install typescript --save-dev</code><br /><br />
            <button onClick={() => changeExample("npm install typescript --save-dev")}>npm</button> <button onClick={() => changeExample("yarn add typescript --dev")}>yarn</button> <button onClick={() => changeExample("pnpm add typescript -D")}>pnpm</button>
          </div>
          <p>所有这些依赖管理器都支持锁定文件，确保团队中的每个人都使用相同版本的语言。然后，你可以使用以下命令之一运行 TypeScript 编译器：</p>
          <div>
            <code id='code-run'>npx tsc</code><br /><br />
            <button onClick={() => changeExample2("npx tsc")}>npm</button> <button onClick={() => changeExample2("yarn tsc")}>yarn</button> <button onClick={() => changeExample2("pnpm tsc")}>pnpm</button>
          </div>
        </div>

        <div style={{ padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>使用 Visual Studio</h3>
          <p>对于大多数项目类型，你可以在 NuGet 中将 TypeScript 作为软件包获取，例如 ASP.NET Core 应用程序。</p>
          <p>使用 NuGet 时，你可以 <a href="https://learn.microsoft.com/visualstudio/javascript/tutorial-aspnet-with-typescript">通过 Visual Studio 安装</a>，使用以下命令：</p>
          <ul>
            <li>
              通过右键单击项目节点打开的“管理 NuGet 包”窗口
            </li>
            <li style={{ marginTop: "20px" }}>
              在工具 &gt; NuGet 包管理器 &gt; 包管理器控制台中运行：<br /><code style={{ fontSize: "14px" }}>Install-Package Microsoft.TypeScript.MSBuild</code>
            </li>
          </ul>
          <p>对于不支持 Nuget 的项目类型，你可以使用 <a href={releaseInfo.vs.stable.vs2019_download}>TypeScript Visual Studio 拓展</a>。你可以通过 Visual Studio 中的<code>扩展 &gt; 管理扩展</code><a href="https://learn.microsoft.com/visualstudio/ide/finding-and-using-visual-studio-extensions">安装该扩展</a>。</p>
        </div>
      </section>
    </div >

    <div className="main-content-block" style={{ textAlign: "center" }}>
      <p>以下示例适用于更高级的用例。</p>
    </div>

    <div className="raised main-content-block">
      <h2>全局安装 TypeScript</h2>
      <p>如果能在所有项目中都可以使用 TypeScript，就会非常方便，尤其是在测试一次性想法的时候。但从长远的角度来看，代码库应优先选择项目范围的安装方式而非全局范围，因为前者便于我们在不同的机器上获得可复现的构建结果。</p>

      <section style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>通过 npm 安装</h3>
          <p>你可以使用 npm 全局安装 TypeScript，这样的话就可以在终端的任何位置使用 <code>tsc</code> 命令。</p>
          <p>要执行此操作，请运行 <code>npm install -g typescript</code>。这将安装最新版本（当前版本为 {releaseInfo.tags.stableMajMin}）。</p>
        </div>

        <div style={{ padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>通过 Visual Studio Marketplace 安装</h3>
          <p>你可以将 TypeScript 以 Visual Studio 扩展的形式安装，这将允许你在 Visual Studio 中的许多 MSBuild 项目中使用 TypeScript。</p>
          <p>最新版本可在 <a href={releaseInfo.vs.stable.vs2019_download} title="Visual Studio Marketplace 中的 TypeScript MSBuild 扩展的链接">Visual Studio Marketplace</a> 中获取。</p>
        </div>
      </section>
    </div>


    <div className="raised main-content-block">
      <h2>使用兼容 TypeScript 的转译器</h2>
      <p>还有其他工具可以将 TypeScript 文件转换为 JavaScript 文件。这些工具可以用来提高速度或与用于与现有构建工具保持一致。</p>
      <p>这些项目中的每个都处理文件转换，但不像 TypeScript 编译器那样会处理类型检查方面。因此，你仍然需要保留上述 TypeScript 依赖项, 并需要启用 <Link to="/tsconfig#isolatedModules"><code>isolatedModules</code></Link>。</p>

      <section style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>Babel</h3>
          <p><a href='https://babeljs.io/'>Babel</a> 是一个非常流行的 JavaScript 转译器，通过插件 <a href='https://babeljs.io/docs/en/babel-preset-typescript#docsNav'>@babel/plugin-transform-typescript</a> 支持 TypeScript 文件。</p>
        </div>

        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>swc</h3>
          <p><a href='https://swc-project.github.io/docs/installation/'>swc</a> 是一个由 Rust 创建的快速转译器，许多 Babel 的功能他都支持，包括 TypeScript。</p>
        </div>

        <div style={{ padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>Sucrase</h3>
          <p><a href='https://github.com/alangpierce/sucrase#sucrase/'>Sucrase</a> 是一个专注于开发模式速度的 Babel 分支。Sucrase 原生支持 TypeScript。</p>
        </div>
      </section>
    </div>

    <QuickJump title="Next Steps" lang={props.pageContext.lang} />
  </Layout>
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>
