import { PlaygroundPlugin, PluginFactory } from ".."
import { createUI } from "../createUI"
import { localize } from "../localizeWithFallback"

type LogEntry = {
  id: string
  name: string
  text: string
}

let allLogs: LogEntry[] = []
let addedClearAction = false

const createCancelButtonSVG = () => {
  const svgNamespace = "http://www.w3.org/2000/svg"
  const svg = document.createElementNS(svgNamespace, "svg")
  svg.setAttribute("width", "13")
  svg.setAttribute("height", "13")
  svg.setAttribute("viewBox", "0 0 13 13")
  svg.setAttribute("fill", "none")

  const circle = document.createElementNS(svgNamespace, "circle")
  circle.setAttribute("cx", "6")
  circle.setAttribute("cy", "7")
  circle.setAttribute("r", "5")
  circle.setAttribute("stroke-width", "2")
  svg.appendChild(circle)

  const line = document.createElementNS(svgNamespace, "line")
  line.setAttribute("x1", "0.707107")
  line.setAttribute("y1", "1.29289")
  line.setAttribute("x2", "11.7071")
  line.setAttribute("y2", "12.2929")
  line.setAttribute("stroke-width", "2")
  svg.appendChild(line)

  return svg
}

export const runPlugin: PluginFactory = (i, utils) => {
  const plugin: PlaygroundPlugin = {
    id: "logs",
    displayName: i("play_sidebar_logs"),
    willMount: (sandbox, container) => {
      const ui = createUI()

      const clearLogsAction = {
        id: "clear-logs-play",
        label: "Clear Playground Logs",
        keybindings: [sandbox.monaco.KeyMod.CtrlCmd | sandbox.monaco.KeyCode.KeyK],

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
      renderLogs(logs, allLogs)
      errorUL.appendChild(logs)

      const logToolsContainer = document.createElement("div")
      logToolsContainer.id = "log-tools"
      container.appendChild(logToolsContainer)

      const clearLogsButton = document.createElement("div")
      clearLogsButton.id = "clear-logs-button"
      clearLogsButton.appendChild(createCancelButtonSVG())
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
        renderLogs(
          eleLog,
          allLogs.filter(log => log.text.includes(inputText))
        )

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
    bindLoggingFunc(replace, rawConsole, "info", "INF")
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
      const eleContainerLog = eleOverflowLocator()
      allLogs.push({ id, name, text: output })
      renderLogs(eleLog, allLogs)
      if (autoScroll && eleContainerLog) {
        eleContainerLog.scrollTop = eleContainerLog.scrollHeight
      }
      raw[name](...objs)
    }
  }

  const objectToText = (arg: any): string => {
    const isObj = typeof arg === "object"
    let textRep = ""
    if (arg && arg.stack && arg.message) {
      textRep = arg.message
    } else if (arg === null) {
      textRep = "null"
    } else if (arg === undefined) {
      textRep = "undefined"
    } else if (typeof arg === "symbol") {
      textRep = String(arg)
    } else if (Array.isArray(arg)) {
      textRep = "[" + arg.map(objectToText).join(", ") + "]"
    } else if (arg instanceof Set) {
      const setIter = [...arg]
      textRep = `Set (${arg.size}) {` + setIter.map(objectToText).join(", ") + "}"
    } else if (arg instanceof Map) {
      const mapIter = [...arg.entries()]
      textRep =
        `Map (${arg.size}) {` +
        mapIter
          .map(([k, v]) => `${objectToText(k)} => ${objectToText(v)}`)
          .join(", ") +
        "}"
    } else if (typeof arg === "string") {
      textRep = '"' + arg + '"'
    } else if (isObj) {
      const name = arg.constructor && arg.constructor.name || ""
      const nameWithoutObject = name && name === "Object" ? "" : name
      const prefix = nameWithoutObject ? `${nameWithoutObject}: ` : ""

      textRep =
        prefix +
        JSON.stringify(
          arg,
          (_, value) => {
            // JSON.stringify omits any keys with a value of undefined. To get around this, we replace undefined with the text __undefined__ and then do a global replace using regex back to keyword undefined
            if (value === undefined) return "__undefined__"
            if (typeof value === 'bigint') return `BigInt('${value.toString()}')`
            return value
          },
          2
        ).replace(/"__undefined__"/g, "undefined")
    } else {
      textRep = String(arg)
    }
    return textRep
  }

  function produceOutput(args: any[]) {
    return args.reduce((output: any, arg: any, index) => {
      const textRep = objectToText(arg)
      const showComma = index !== args.length - 1
      const comma = showComma ? ", " : ""
      return output + textRep + comma + " "
    }, "")
  }
}

// The reflect-metadata runtime is available, so allow that to go through
function sanitizeJS(code: string) {
  return code.replace(`import "reflect-metadata"`, "").replace(`require("reflect-metadata")`, "")
}

function renderLogs(container: Element, logs: LogEntry[]) {
  container.textContent = ""

  logs.forEach((log, index) => {
    if (index > 0) container.appendChild(document.createElement("hr"))

    container.appendChild(document.createTextNode("["))

    const id = document.createElement("span")
    id.className = "log-" + log.name
    id.textContent = log.id
    container.appendChild(id)

    container.appendChild(document.createTextNode("]: " + log.text))
    container.appendChild(document.createElement("br"))
  })
}
