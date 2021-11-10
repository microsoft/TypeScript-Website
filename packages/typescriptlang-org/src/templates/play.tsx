import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { Layout } from "../components/layout"
import { withPrefix, graphql } from "gatsby"

import "./play.scss"
import { RenderExamples } from "../components/ShowExamples"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { hasLocalStorage } from "../lib/hasLocalStorage"
import { headCopy } from "../copy/en/head-seo"
import { playCopy } from "../copy/en/playground"

import { Intl } from "../components/Intl"
import "reflect-metadata"

import playgroundReleases from "../../../sandbox/src/releases.json"
import { getPlaygroundUrls } from "../lib/playgroundURLs"

// This gets set by the playground
declare const playground: ReturnType<typeof import("@typescript/playground").setupPlayground>

type Props = {
  pageContext: {
    lang: string
    examplesTOC: typeof import("../../static/js/examples/en.json")
    optionsSummary: any // this is just passed through to the playground JS library at this point
    playgroundHandbookTOC: { docs : any[] }
  }
}

const Play: React.FC<Props> = (props) => {
  const i = createInternational<typeof headCopy & typeof playCopy>(useIntl())

  useEffect(() => {
    if (!document.getElementById("monaco-editor-embed")) return
    if (document.getElementById("monaco-editor-embed")!.childElementCount > 0) {
      return console.log("Playground already loaded")
    }

    // Detect if you've left the playground and come back via the back button, which will force
    // a page reload to ensure the playground is full set up
    let leftPlayground = false
    window.addEventListener('popstate', (event) => {
      const onPlayground = document.location.pathname.endsWith("/play/") || document.location.pathname.endsWith("/play")
      if (leftPlayground && onPlayground) {
        document.location.reload()
      } else if (!leftPlayground && !onPlayground) {
        leftPlayground = true
      }
    });

    if (!hasLocalStorage) {
      document.getElementById("loading-message")!.innerText = "Cannot load the Playground with storage disabled in your browser"
      return
    }

    // @ts-ignore - so the playground handbook can grab this data
    window.playgroundHandbookTOC = props.pageContext.playgroundHandbookTOC
    // @ts-ignore - so the config options can use localized descriptions
    window.optionsSummary = props.pageContext.optionsSummary
    // @ts-ignore - for React-based plugins
    window.react = React
    // @ts-ignore - for React-based plugins
    window.reactDOM = ReactDOM
    // @ts-ignore - so that plugins etc can use i18n
    window.i = i

    const getLoaderScript = document.createElement('script');
    getLoaderScript.src = withPrefix("/js/vs.loader.js");
    getLoaderScript.async = true;
    getLoaderScript.onload = async () => {
      const params = new URLSearchParams(location.search)

      let tsVersionParam = params.get("ts")
      // handle the nightly lookup 
      if (tsVersionParam && tsVersionParam === "Nightly" || tsVersionParam === "next") {
        // Avoids the CDN to doubly skip caching
        const nightlyLookup = await fetch("https://tswebinfra.blob.core.windows.net/indexes/next.json", { cache: "no-cache" })
        const nightlyJSON = await nightlyLookup.json()
        tsVersionParam = nightlyJSON.version
      }

      // Somehow people keep trying -insiders urls instead of -dev - maybe some tooling I don't know?
      if (tsVersionParam && tsVersionParam.includes("-insiders.")) {
        tsVersionParam = tsVersionParam.replace("-insiders.", "-dev.")
      }

      const latestRelease = [...playgroundReleases.versions].sort().pop()!
      const tsVersion = tsVersionParam || latestRelease

      // Because we can reach to localhost ports from the site, it's possible for the locally built compiler to 
      // be hosted and to power the editor with a bit of elbow grease.
      const useLocalCompiler = tsVersion === "dev"
      const devIsh = ["pr", "dev"]
      const version = devIsh.find(d => tsVersion.includes(d)) ? "dev" : "min"
      const urlForMonaco = useLocalCompiler ? "http://localhost:5615/dev/vs" : `https://typescript.azureedge.net/cdn/${tsVersion}/monaco/${version}/vs`

      // Make a quick HEAD call for the main monaco editor for this version of TS, if it
      // bails then give a useful error message and bail.
      const nightlyLookup = await fetch(urlForMonaco + "/editor/editor.main.js", { method: "HEAD" })
      if (!nightlyLookup.ok) {
        document.querySelectorAll<HTMLDivElement>(".lds-grid div").forEach(div => {
          div.style.backgroundColor = "red"
          div.style.animation = ""
          div.style.webkitAnimation = ""
        })

        document.getElementById("loading-message")!.innerHTML = `This version of TypeScript <em>(${tsVersion?.replace("<", "-")})</em><br/>has not been prepared for the Playground<br/><br/>Try <a href='/play?ts=${latestRelease}${document.location.hash}'>${latestRelease}</a> or <a href="/play?ts=next${document.location.hash}">Nightly</a>`
        return
      }

      // Allow prod/staging builds to set a custom commit prefix to bust caches
      const {sandboxRoot, playgroundRoot} = getPlaygroundUrls()
      
      // @ts-ignore
      const re: any = global.require
      re.config({
        paths: {
          vs: urlForMonaco,
          "typescript-sandbox": sandboxRoot,
          "typescript-playground": playgroundRoot,
          "unpkg": "https://unpkg.com",
          "local": "http://localhost:5000",
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
        catchError: true,
        onError: function (err) {
          if (document.getElementById("loading-message")) {
            document.getElementById("loading-message")!.innerText = "Cannot load the Playground in this browser"
            console.error("Error setting up monaco/sandbox/playground from the JS, this is likely that you're using a browser which monaco doesn't support.")
          } else {
            console.error("Caught an error which is likely happening during initializing a playground plugin:")
          }
          console.error(err)
        }
      });

      re(["vs/editor/editor.main", "vs/language/typescript/tsWorker", "typescript-sandbox/index", "typescript-playground/index"], async (main: typeof import("monaco-editor"), tsWorker: any, sandbox: typeof import("@typescript/sandbox"), playground: typeof import("@typescript/playground")) => {
        // Importing "vs/language/typescript/tsWorker" will set ts as a global
        const ts = (global as any).ts
        const isOK = main && ts && sandbox && playground

        if (isOK) {
          document.getElementById("loader")!.parentNode?.removeChild(document.getElementById("loader")!)
        } else {
          console.error("Errr")
          console.error("main", !!main, "ts", !!ts, "sandbox", !!sandbox, "playground", !!playground)
        }

        // Set the height of monaco to be either your window height or 600px - whichever is smallest
        const container = document.getElementById("playground-container")!
        container.style.display = "flex"
        const height = Math.max(window.innerHeight, 600)
        container.style.height = `${height - Math.round(container.getClientRects()[0].top) - 18}px`

        // Create the sandbox
        const sandboxEnv = await sandbox.createTypeScriptSandbox({
          text: localStorage.getItem('sandbox-history') || i("play_default_code_sample"),
          compilerOptions: {},
          domID: "monaco-editor-embed",
          filetype: (!!params.get("useJavaScript") ? "js" : params.get("filetype") || "ts") as any,
          acquireTypes: !localStorage.getItem("disable-ata"),
          supportTwoslashCompilerOptions: true,
          monacoSettings: {
            fontFamily: "var(--code-font)",
            fontLigatures: true
          }
        }, main, ts)

        const playgroundConfig = {
          lang: props.pageContext.lang,
          prefix: withPrefix("/"),
          supportCustomPlugins: true
        }

        playground.setupPlayground(sandboxEnv, main, playgroundConfig, i as any, React)

        // Dark mode faff
        const darkModeEnabled = document.documentElement.classList.contains("dark-theme")
        if (darkModeEnabled) {
          sandboxEnv.monaco.editor.setTheme("sandbox-dark");
        }

        sandboxEnv.editor.focus()
        sandboxEnv.editor.layout()
      });
    }

    document.body.appendChild(getLoaderScript);
  }, [])


  return (
    <Layout title={i("head_playground_title")} description={i("head_playground_description")} lang={props.pageContext.lang}>
      {/** This is the top nav, which is outside of the editor  */}
      <nav className="navbar-sub">
        <ul className="nav">
          <li className="name hide-small"><span>Playground</span></li>

          <li className="dropdown">
            <a id="compiler-options-button" href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="compiler-options-dropdown">{i("play_subnav_config")} <span className="caret"></span></a>
            <ul id="compiler-options-dropdown" className="examples-dropdown" aria-labelledby="compiler-options-button">
              <h3>{i("play_subnav_config")}</h3>
              <div className="info" id="config-container">
                <button className="examples-close">{i("play_subnav_examples_close")}</button>

                <div id="compiler-dropdowns">
                  <label className="select">
                    <span className="select-label">Lang</span>
                    <select id="language-selector">
                      <option>TypeScript</option>
                      <option>TypeScript Definitions</option>
                      <option>JavaScript</option>
                    </select>
                    <span className="compiler-flag-blurb">{i("play_config_language_blurb")}</span>
                  </label>
                </div>

              </div>
            </ul>
          </li>

          <li className="dropdown">
            <a href="#" id="handbook-button" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="examples">{i("play_subnav_handbook")} <span className="caret"></span></a>
          </li>

          <li className="dropdown">
            <a href="#" id="examples-button" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="examples">{i("play_subnav_examples")} <span className="caret"></span></a>
            <ul className="examples-dropdown" id="examples" aria-labelledby="examples-button">
              <button className="examples-close" aria-label="Close dropdown" role="button">{i("play_subnav_examples_close")}</button>
              <RenderExamples defaultSection="TypeScript" sections={["JavaScript", "TypeScript"]} examples={props.pageContext.examplesTOC} locale={props.pageContext.lang} />
            </ul>
          </li>

          <li className="dropdown">
            <a href="#" id="whatisnew-button" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="whatisnew">{i("play_subnav_whatsnew")} <span className="caret"></span></a>
            <ul className="examples-dropdown" id="whatisnew" aria-labelledby="whatisnew-button">
              <button role="button" aria-label="Close dropdown" className="examples-close">{i("play_subnav_examples_close")}</button>
              <RenderExamples defaultSection="4.4" sections={["4.4", "4.3", "4.2", "4.1", "4.0", "3.8", "3.7", "Playground"]} examples={props.pageContext.examplesTOC} locale={props.pageContext.lang} />
            </ul>
          </li>
        </ul>

        <ul className="nav navbar-nav navbar-right hidden-xs">
          <li><a href="#" id="playground-settings" role="button">Settings</a></li>
        </ul>
      </nav>

      <div className="raised" style={{ paddingTop: "0", marginTop: "0", marginBottom: "3rem", paddingBottom: "1.5rem" }}>
        <div id="loader">
          <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
          <p id="loading-message" role="status">{i("play_downloading_typescript")}</p>
        </div>
        <div id="playground-container" style={{ display: "none" }}>
          <div id="editor-container">
            <div id="story-container" style={{ display: "none" }}></div>
            <div id="editor-toolbar" className="navbar-sub" >

              <ul>
                <li id="versions" className="dropdown" >
                  <a href="#" data-toggle="dropdown" role="button" aria-haspopup="menu" aria-expanded="false" aria-controls="versions-dropdown" id='versions-button'>{i("play_downloading_version")}... <span className="caret" /></a>
                  <ul className="dropdown-menu versions" id="versions-dropdown" aria-labelledby="versions-button"></ul>
                </li>
                <li><a id="run-button" href="#" role="button">{i("play_toolbar_run")}</a></li>

                <li className="dropdown">
                  <a href="#" id="exports-dropdown" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false" aria-controls="export-dropdown-menu">{i("play_toolbar_export")} <span className="caret"></span></a>
                  <ul className="dropdown-menu" id='export-dropdown-menu' aria-labelledby="whatisnew-button">
                    <li><a href="#" onClick={() => playground.exporter.exportAsTweet()} aria-label={i("play_export_tweet_md")} >{i("play_export_tweet_md")}</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={(e: any) => playground.exporter.copyAsMarkdownIssue(e)} aria-label={i("play_export_copy_md")} >{i("play_export_copy_md")}</a></li>
                    <li><a href="#" onClick={(e: any) => playground.exporter.copyForChat(e)} aria-label={i("play_export_copy_link")}  >{i("play_export_copy_link")}</a></li>
                    < li > <a href="#" onClick={(e: any) => playground.exporter.copyForChatWithPreview(e)} aria-label={i("play_export_copy_link_preview")}  >{i("play_export_copy_link_preview")}</a></li>
                    < li role="separator" className="divider" ></li>
                    <li><a href="#" onClick={() => playground.exporter.openInTSAST()} aria-label={i("play_export_tsast")}>{i("play_export_tsast")}</a></li>
                    <li><a href="#" onClick={() => playground.exporter.openInBugWorkbench()} aria-label={i("play_export_bugworkbench")}>{i("play_export_bugworkbench")}</a></li>
                    <li role="separator" className="divider"></li>
                    <li><a href="#" onClick={() => playground.exporter.openProjectInCodeSandbox()} aria-label={i("play_export_sandbox")} >{i("play_export_sandbox")}</a></li>
                    <li><a href="#" onClick={() => playground.exporter.openProjectInStackBlitz()} aria-label={i("play_export_stackblitz")} >{i("play_export_stackblitz")}</a></li>
                  </ul>
                </li>
                <li><a id="share-button" href="#" role="button">{i("play_toolbar_share")}</a></li>
              </ul>

              <ul className="right">
                <li><a id="sidebar-toggle" aria-label="Hide Sidebar" href="#">&#x21E5;</a></li>
              </ul>
            </div>
            { /** This is the div which monaco is added into - careful, lots of changes happen here at runtime **/}
            <div id="monaco-editor-embed" />
          </div>
        </div>
      </div>
    </Layout>
  )
}


export default (props: Props) => <Intl locale={props.pageContext.lang}><Play {...props} /></Intl>
