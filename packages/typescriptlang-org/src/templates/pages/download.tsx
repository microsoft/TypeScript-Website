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

  return <Layout title="How to set up TypeScript" description="Add TypeScript to your project, or install TypeScript globally" lang={props.pageContext.lang}>
    <div className="raised main-content-block">
      <h1>Download TypeScript</h1>
      <p>TypeScript can be installed through three installation routes depending on how you intend to use it: an npm module, a NuGet package or a Visual Studio Extension.</p>
      <p>If you are using Node.js, you want the npm version. If you are using MSBuild in your project, you want the NuGet package or Visual Studio extension.</p>
    </div>

    <div className="raised main-content-block">
      <h2>TypeScript in Your Project</h2>
      <p>Having TypeScript set up on a per-project basis lets you have many projects with many different versions of TypeScript, this keeps each project working consistently.</p>

      <section style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>via npm</h3>
          <p>TypeScript is available as a <a href="https://www.npmjs.com/package/typescript">package on the npm registry</a> available as <code>"typescript"</code>.</p>
          <p>You will need a copy of <a title="Link to the node.js project" href="https://nodejs.org/en/">Node.js</a> as an environment to run the package. Then you use a dependency manager like <a title="Link to the npm package manager" href='https://www.npmjs.com/'>npm</a>, <a title="Link to the yarn package manager" href='https://yarnpkg.com/'>yarn</a> or <a title="Link to the pnpm package manager" href='https://pnpm.js.org/'>pnpm</a> to download TypeScript into your project.</p>
          <div>
            <code id='code-example'>npm install typescript --save-dev</code><br /><br />
            <button onClick={() => changeExample("npm install typescript --save-dev")}>npm</button> <button onClick={() => changeExample("yarn add typescript --dev")}>yarn</button> <button onClick={() => changeExample("pnpm add typescript -D")}>pnpm</button>
          </div>
          <p>All of these dependency managers support lockfiles, ensuring that everyone on your team is using the same version of the language. You can then run the TypeScript compiler using one of the following commands:</p>
          <div>
            <code id='code-run'>npx tsc</code><br /><br />
            <button onClick={() => changeExample2("npx tsc")}>npm</button> <button onClick={() => changeExample2("yarn tsc")}>yarn</button> <button onClick={() => changeExample2("pnpm tsc")}>pnpm</button>
          </div>
        </div>

        <div style={{ padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>with Visual Studio</h3>
          <p>For most project types, you can get TypeScript as a package in Nuget for your MSBuild projects, for example an ASP.NET Core app.</p>
          <p>When using Nuget, you can <a href="https://learn.microsoft.com/visualstudio/javascript/tutorial-aspnet-with-typescript">install TypeScript through Visual Studio</a> using:</p>
          <ul>
            <li>
              The Manage NuGet Packages window (which you can get to by right-clicking on a project node)
            </li>
            <li style={{ marginTop: "20px" }}>
              The Nuget Package Manager Console (found in Tools &gt; NuGet Package Manager &gt; Package Manager Console) and then running:<br /><code style={{ fontSize: "14px" }}>Install-Package Microsoft.TypeScript.MSBuild</code>
            </li>
          </ul>
          <p>For project types which don't support Nuget, you can use the <a href={releaseInfo.vs.stable.vs2019_download}> TypeScript Visual Studio extension</a>. You can <a href="https://learn.microsoft.com/visualstudio/ide/finding-and-using-visual-studio-extensions">install the extension</a> using <code>Extensions &gt; Manage Extensions</code> in Visual Studio.</p>
        </div>
      </section>
    </div >

    <div className="main-content-block" style={{ textAlign: "center" }}>
      <p>The examples below are for more advanced use cases.</p>
    </div>

    <div className="raised main-content-block">
      <h2>Globally Installing TypeScript</h2>
      <p>It can be handy to have TypeScript available across all projects, often to test one-off ideas. Long-term, codebases should prefer a project-wide installation over a global install so that they can benefit from reproducible builds across different machines.</p>

      <section style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>via npm</h3>
          <p>You can use npm to install TypeScript globally, this means that you can use the <code>tsc</code> command anywhere in your terminal.</p>
          <p>To do this, run <code>npm install -g typescript</code>. This will install the latest version (currently {releaseInfo.tags.stableMajMin}).</p>
          <p>An alternative is to use <a title="Link to the npx package on npm" href="https://www.npmjs.com/package/npx">npx</a> when you have to run <code>tsc</code> for one-off occasions.</p>
        </div>

        <div style={{ padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>via Visual Studio Marketplace</h3>
          <p>You can install TypeScript as a Visual Studio extension, which will allow you to use TypeScript across many MSBuild projects in Visual Studio.</p>
          <p>The latest version is available <a href={releaseInfo.vs.stable.vs2019_download} title="Link to the Visual Studio Marketplace for the TypeScript MSBuild extension">in the Visual Studio Marketplace</a>.</p>
        </div>
      </section>
    </div>


    <div className="raised main-content-block">
      <h2>Working with TypeScript-compatible transpilers</h2>
      <p>There are other tools which convert TypeScript files to JavaScript files. You might use these tools for speed or consistency with your existing build tooling.</p>
      <p>Each of these projects handle the file conversion, but do not handle the type-checking aspects of the TypeScript compiler. So it's likely that you will still need to keep the above TypeScript dependency around, and you will want to enable <Link to="/tsconfig#isolatedModules"><code>isolatedModules</code></Link>.</p>

      <section style={{ display: "flex", flexWrap: "wrap" }}>
        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>Babel</h3>
          <p><a href='https://babeljs.io/'>Babel</a> is a very popular JavaScript transpiler which supports TypeScript files via the plugin <a href='https://babeljs.io/docs/en/babel-preset-typescript#docsNav'>@babel/plugin-transform-typescript</a>.</p>
        </div>

        <div style={{ borderRight: "1px lightgrey solid", padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>swc</h3>
          <p><a href='https://swc-project.github.io/docs/installation/'>swc</a> is a fast transpiler created in Rust which supports many of Babel's features including TypeScript.</p>
        </div>

        <div style={{ padding: "1rem", flex: 1, minWidth: "240px" }}>
          <h3>Sucrase</h3>
          <p><a href='https://github.com/alangpierce/sucrase#sucrase/'>Sucrase</a> is a Babel fork focused on speed for using in development mode. Sucrase supports TypeScript natively.</p>
        </div>
      </section>
    </div>

    <QuickJump title="Next Steps" lang={props.pageContext.lang} />
  </Layout>
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>
