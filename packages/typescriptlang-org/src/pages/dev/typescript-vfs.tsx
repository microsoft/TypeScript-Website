import * as React from "react"
import { Layout } from "../../components/layout"
import { withPrefix, graphql, Link } from "gatsby"

import "./dev.scss"
import { Intl } from "../../components/Intl"
import { DevNav } from "../../components/devNav"

type Props = {}

const Index: React.FC<Props> = (props) => {
  return (
    <>
      <Layout title="Developers - TypeScript VFS" description="Run TypeScript in the browser, or anywhere - using a virtual file-system" lang="en">
        <div id="dev">
          <DevNav active="typescript vfs" />
          <div className="raised content main-content-block">
            <div className="split-fivehundred">
              <h1 style={{ marginTop: "20px" }}>Easy access to the compiler API</h1>
              <p>TypeScript VFS lets you create a self-contained TypeScript environment entirely under your control. This library is used to power the Playground, and provides the underlying tooling for <Link to="/dev/twoslash">twoslash</Link> code samples.</p>
              <p>There are 3 main uses for TypeScript VFS:</p>
              <ul>
                <li>Creating a TypeScript Program as an entry-point to the compiler API</li>
                <li>Running TypeScript to emit files like <code>*.js</code>, <code>*.d.ts</code> or <code>*.map</code></li>
                <li>Using TypeScript's language service to make the same calls an editor would make</li>
              </ul>
              <p>You can learn more in the <a href="https://github.com/microsoft/TypeScript-Website/blob/v2/packages/typescript-vfs/">TypeScript VFS README</a></p>
            </div>

            <div className="fivehundred" style={{ borderLeft: "1px solid gray", padding: "20px" }}>
              <h3>Setup with TypeScript from node_modules</h3>
              <pre tabIndex={0}><code className="html-code">{`import ts from 'typescript'
import tsvfs from '@typescript/vfs'

const fsMap = tsvfs.createDefaultMapFromNodeModules({ target: ts.ScriptTarget.ES2015 })
fsMap.set('index.ts', 'console.log("Hello World")')

// ....
              `}</code></pre>

              <h3>Use the TypeScript CDN to get your lib.d.ts files</h3>
              <pre tabIndex={0}><code className="html-code">{`import ts from 'typescript'
import tsvfs from '@typescript/vfs'

const fsMap = await tsvfs.createDefaultMapFromCDN(compilerOptions, ts.version, true, ts)
fsMap.set('index.ts', 'console.log("Hello World")')

const system = tsvfs.createSystem(fsMap)
const host = tsvfs.createVirtualCompilerHost(system, compilerOptions, ts)

const program = ts.createProgram({
  rootNames: [...fsMap.keys()],
  options: compilerOptions,
  host: host.compilerHost,
})

// This will update the fsMap with new files
// for the .d.ts and .js files
program.emit()

// Now I can look at the AST for the .ts file too
const index = program.getSourceFile('index.ts')
              `}</code></pre>
            </div>
          </div>
        </div>
      </Layout >
    </>
  )
}

export default (props: Props) => <Intl locale="en"><Index {...props} /></Intl>
