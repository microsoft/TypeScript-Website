import React from "react"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"
import { graphql } from "gatsby"

import releaseInfo from "../../lib/release-info.json"


const changeExample = (code: string) => document.getElementById("code-example")!.textContent = code

const Index = (props: any) =>
  <Layout title="How to set up TypeScript" description="" lang="en" allSitePage={props.data.allSitePage}>
    <div className="raised main-content-block">
      <h1>Download TypeScript</h1>
      <p>TypeScript is available in two main ways depending on how you intend to use it: built as an npm module, and a nuget package.</p>
      <p>If you are using MSBuild in your project, you want the nuget package, otherwise you will want the npm version.</p>
    </div>

    <div className="raised main-content-block">
      <h1>TypeScript in Your Project</h1>
      <p>Having TypeScript set up in a per-project basis lets you have many projects with many different versions of TypeScript, this keeps each project working consistently.</p>
      <section style={{ display: "flex" }}>
        <div style={{ borderRight: "1px grey solid", padding: "1rem", flex: 1 }}>
          <h2>via NPM</h2>
          <p>TypeScript is available as a <a href="https://www.npmjs.com/package/typescript">package on the npm registry</a> available as <code>"typescript"</code>.</p>
          <p>In order to use TypeScript this way, you will need a copy of <a href="https://nodejs.org/en/">Node.js</a> as an environment to run the package. Then you use a dependency manager like <a href='https://www.npmjs.com/'>npm</a>, <a href='https://yarnpkg.com/'>yarn</a> or <a href='https://pnpm.js.org/'>pnpm</a> to download TypeScript into your project.</p>
          <p>All of these dependency managers support lockfiles, so you can ensure that everyone on your team is using the same version of the language.</p>

          <div>
            <code id='code-example'>npm install typescript --save-dev</code><br /><br />
            <button onClick={() => changeExample("npm install typescript --save-dev")}>npm</button> <button onClick={() => changeExample("yarn add typescript --dev")}>yarn</button> <button onClick={() => changeExample("pnpm add typescript -D")}>pnpm</button>
          </div>
        </div>

        <div style={{ padding: "1rem", flex: 1 }}>
          <h2>via Nuget</h2>
          <p>You can get TypeScript as a package in Nuget for your MSBuild projects, for example an ASP.NET Core app.</p>
          <p>You can <a href="https://docs.microsoft.com/en-us/visualstudio/javascript/tutorial-aspnet-with-typescript">install</a> TypeScript through Visual Studio using:</p>
          <ul>
            <li>
              The Manage NuGet Packages window (which you can get to by right-clicking on a project node)
           </li>
            <li style={{ marginTop: "20px" }}>
              The Nuget Package Manager Console (found in Tools > NuGet Package Manager > Package Manager Console) using <code>Install-Package Microsoft.TypeScript.MSBuild</code>
            </li>
          </ul>
        </div>
      </section>
    </div >

    <div className="raised main-content-block">
      <h1>Globally Installing TypeScript</h1>
      <section style={{ display: "flex" }}>
        <div style={{ borderRight: "1px grey solid", padding: "1rem", flex: 1 }}>
          <h2>via NPM</h2>
          <p>{`You can use npm to install TypeScript globally, this means you can use the <code>tsc<code> command anywhere in your terminal. To do this, run <code>npm install -g typescript<code>. This will install the latest version (currently ${releaseInfo.tags.stableMajMin}).`}</p>
          <p>An alternative is to use <a href="">npx</a>`</p>
        </div>

        <div style={{ padding: "1rem", flex: 1 }}>
          <h2>via Nuget</h2>
          <p>WIP - need to think about VS Marketplace too.</p>
        </div>
      </section>
    </div >

  </Layout >

export default (props: any) => <Intl><Index {...props} /></Intl>


export const query = graphql`
  query {
      ...AllSitePage
    }
    `
