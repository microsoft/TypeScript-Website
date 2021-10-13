import { Sandbox } from "typescriptlang-org/static/js/sandbox"
import { PlaygroundPlugin, PluginFactory } from ".."
import { createUI, UI } from "../createUI"
import { localize } from "../localizeWithFallback"

let allLogs: string[] = []
let addedClearAction = false
const cancelButtonSVG = `
<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="6" cy="7" r="5" stroke-width="2"/>
<line x1="0.707107" y1="1.29289" x2="11.7071" y2="12.2929" stroke-width="2"/>
</svg>
`

export const runPlugin: PluginFactory = (i, utils) => {
  const plugin: PlaygroundPlugin = {
    id: "logs",
    displayName: i("play_sidebar_logs"),
    willMount: (sandbox, container) => {
      const ui = createUI()

      const clearLogsAction = {
        id: "clear-logs-play",
        label: "Clear Playground Logs",
        keybindings: [sandbox.monaco.KeyMod.CtrlCmd | sandbox.monaco.KeyCode.KEY_K],

        contextMenuGroupId: "run",
        contextMenuOrder: 1.5,

        run: function () {
          clearLogs()
          ui.flashInfo(i("play_clear_logs"))
        },
      }

      if (!addedClearAction) {
        sandbox.editor.addAction(clearLogsAction)
        addedClearAction = true
      }

      const errorUL = document.createElement("div")
      errorUL.id = "log-container"
      container.appendChild(errorUL)

      const logs = document.createElement("div")
      logs.id = "log"
      logs.innerHTML = allLogs.join("<hr />")
      errorUL.appendChild(logs)

      const logToolsContainer = document.createElement("div")
      logToolsContainer.id = "log-tools"
      container.appendChild(logToolsContainer)

      const clearLogsButton = document.createElement("div")
      clearLogsButton.id = "clear-logs-button"
      clearLogsButton.innerHTML = cancelButtonSVG
      clearLogsButton.onclick = e => {
        e.preventDefault()
        clearLogsAction.run()

        const filterTextBox: any = document.getElementById("filter-logs")
        filterTextBox!.value = ""
      }
      logToolsContainer.appendChild(clearLogsButton)

      const filterTextBox = document.createElement("input")
      filterTextBox.id = "filter-logs"
      filterTextBox.placeholder = i("play_sidebar_tools_filter_placeholder")
      filterTextBox.addEventListener("input", (e: any) => {
        const inputText = e.target.value

        const eleLog = document.getElementById("log")!
        eleLog.innerHTML = allLogs
          .filter(log => {
            const userLoggedText = log.substring(log.indexOf(":") + 1, log.indexOf("&nbsp;<br>"))
            return userLoggedText.includes(inputText)
          })
          .join("<hr />")

        if (inputText === "") {
          const logContainer = document.getElementById("log-container")!
          logContainer.scrollTop = logContainer.scrollHeight
        }
      })
      logToolsContainer.appendChild(filterTextBox)

      if (allLogs.length === 0) {
        const noErrorsMessage = document.createElement("div")
        noErrorsMessage.id = "empty-message-container"
        container.appendChild(noErrorsMessage)

        const message = document.createElement("div")
        message.textContent = localize("play_sidebar_logs_no_logs", "No logs")
        message.classList.add("empty-plugin-message")
        noErrorsMessage.appendChild(message)

        errorUL.style.display = "none"
        logToolsContainer.style.display = "none"
      }
    },
  }

  return plugin
}

export const clearLogs = () => {
  allLogs = []
  const logs = document.getElementById("log")
  if (logs) {
    logs.textContent = ""
  }
}

export const runWithCustomLogs = (closure: Promise<string>, i: Function) => {
  const noLogs = document.getElementById("empty-message-container")
  const logContainer = document.getElementById("log-container")!
  const logToolsContainer = document.getElementById("log-tools")!
  if (noLogs) {
    noLogs.style.display = "none"
    logContainer.style.display = "block"
    logToolsContainer.style.display = "flex"
  }

  rewireLoggingToElement(
    () => document.getElementById("log")!,
    () => document.getElementById("log-container")!,
    closure,
    true,
    i
  )
}

// Thanks SO: https://stackoverflow.com/questions/20256760/javascript-console-log-to-html/35449256#35449256

function rewireLoggingToElement(
  eleLocator: () => Element,
  eleOverflowLocator: () => Element,
  closure: Promise<string>,
  autoScroll: boolean,
  i: Function
) {
  const rawConsole = console

  closure.then(js => {
    const replace = {} as any
    bindLoggingFunc(replace, rawConsole, "log", "LOG")
    bindLoggingFunc(replace, rawConsole, "debug", "DBG")
    bindLoggingFunc(replace, rawConsole, "warn", "WRN")
    bindLoggingFunc(replace, rawConsole, "error", "ERR")
    replace["clear"] = clearLogs
    const console = Object.assign({}, rawConsole, replace)
    try {
      const safeJS = sanitizeJS(js)
      eval(safeJS)
    } catch (error) {
      console.error(i("play_run_js_fail"))
      console.error(error)

      if (error instanceof SyntaxError && /\bexport\b/u.test(error.message)) {
        console.warn(
          'Tip: Change the Module setting to "CommonJS" in TS Config settings to allow top-level exports to work in the Playground'
        )
      }
    }
  })

  function bindLoggingFunc(obj: any, raw: any, name: string, id: string) {
    obj[name] = function (...objs: any[]) {
      const output = produceOutput(objs)
      const eleLog = eleLocator()
      const prefix = `[<span class="log-${name}">${id}</span>]: `
      const eleContainerLog = eleOverflowLocator()
      allLogs.push(`${prefix}${output}<br>`)
      eleLog.innerHTML = allLogs.join("<hr />")
      if (autoScroll && eleContainerLog) {
        eleContainerLog.scrollTop = eleContainerLog.scrollHeight
      }
      raw[name](...objs)
    }
  }

  // Inline constants which are switched out at the end of processing
  const replacers = {
    "<span class='literal'>null</span>": "1231232131231231423434534534",
    "<span class='literal'>undefined</span>": "4534534534563567567567",
    "<span class='comma'>, </span>": "785y8345873485763874568734y535438"
  }

  const objectToText = (arg: any): string => {
    const isObj = typeof arg === "object"
    let textRep = ""
    if (arg && arg.stack && arg.message) {
      // special case for err
      textRep = htmlEscape(arg.message)
    } else if (arg === null) {
      textRep = replacers["<span class='literal'>null</span>"]
    } else if (arg === undefined) {
      textRep = replacers["<span class='literal'>undefined</span>"]
    } else if (typeof arg === "symbol") {
      textRep = `<span class='literal'>${htmlEscape(String(arg))}</span>`
    } else if (Array.isArray(arg)) {
      textRep = "[" + arg.map(objectToText).join(replacers["<span class='comma'>, </span>"]) + "]"
    } else if (arg instanceof Set) {
      const setIter = [...arg]
      textRep = `Set (${arg.size}) {` + setIter.map(objectToText).join(replacers["<span class='comma'>, </span>"]) + "}"
    } else if (arg instanceof Map) {
      const mapIter = [...arg.entries()]
      textRep =
        `Map (${arg.size}) {` +
        mapIter.map(([k, v]) => `${objectToText(k)} => ${objectToText(v)}`).join(replacers["<span class='comma'>, </span>"]) +
        "}"
    } else if (typeof arg === "string") {
      textRep = '"' + htmlEscape(arg) + '"'
    } else if (isObj) {
      const name = arg.constructor && arg.constructor.name
      // No one needs to know an obj is an obj
      const nameWithoutObject = name && name === "Object" ? "" : htmlEscape(name)
      const prefix = nameWithoutObject ? `${nameWithoutObject}: ` : ""

      // JSON.stringify omits any keys with a value of undefined. To get around this, we replace undefined with the text __undefined__ and then do a global replace using regex back to keyword undefined
      textRep =
        prefix +
        JSON.stringify(arg, (_, value) => (value === undefined ? "__undefined__" : value), 2).replace(
          /"__undefined__"/g,
          "undefined"
        )

      textRep = htmlEscape(textRep)
    } else {
      textRep = htmlEscape(String(arg))
    }
    return textRep
  }

  function produceOutput(args: any[]) {
    let result: string = args.reduce((output: any, arg: any, index) => {
      const textRep = objectToText(arg)
      const showComma = index !== args.length - 1
      const comma = showComma ? "<span class='comma'>, </span>" : ""
      return output + textRep + comma + " "
    }, "")

    Object.keys(replacers).forEach(k => {
      result = result.replace(new RegExp((replacers as any)[k], "g"), k)
    })

    return result
  }
}

// The reflect-metadata runtime is available, so allow that to go through
function sanitizeJS(code: string) {
  return code.replace(`import "reflect-metadata"`, "").replace(`require("reflect-metadata")`, "")
}

function htmlEscape(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}