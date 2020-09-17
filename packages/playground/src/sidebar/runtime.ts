import { Sandbox } from "typescriptlang-org/static/js/sandbox"
import { PlaygroundPlugin, PluginFactory } from ".."
import { createUI, UI } from "../createUI"
import { localize } from "../localizeWithFallback"

let allLogs = ""
let addedClearAction = false

export const runPlugin: PluginFactory = (i, utils) => {
  const plugin: PlaygroundPlugin = {
    id: "logs",
    displayName: i("play_sidebar_logs"),
    willMount: (sandbox, container) => {
      if (!addedClearAction) {
        const ui = createUI()
        addClearAction(sandbox, ui, i)
      }

      if (allLogs.length === 0) {
        const noErrorsMessage = document.createElement("div")
        noErrorsMessage.id = "empty-message-container"
        container.appendChild(noErrorsMessage)

        const message = document.createElement("div")
        message.textContent = localize("play_sidebar_logs_no_logs", "No logs")
        message.classList.add("empty-plugin-message")
        noErrorsMessage.appendChild(message)
      }

      const errorUL = document.createElement("div")
      errorUL.id = "log-container"
      container.appendChild(errorUL)

      const logs = document.createElement("div")
      logs.id = "log"
      logs.innerHTML = allLogs
      errorUL.appendChild(logs)
    },
  }

  return plugin
}

export const clearLogs = () => {
  allLogs = ""
  const logs = document.getElementById("log")
  if (logs) {
    logs.textContent = ""
  }
}

export const runWithCustomLogs = (closure: Promise<string>, i: Function) => {
  const noLogs = document.getElementById("empty-message-container")
  if (noLogs) {
    noLogs.style.display = "none"
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
  fixLoggingFunc("log", "LOG")
  fixLoggingFunc("debug", "DBG")
  fixLoggingFunc("warn", "WRN")
  fixLoggingFunc("error", "ERR")
  fixLoggingFunc("info", "INF")
  // @ts-expect-error
  console["oldclear"] = console.clear
  console.clear = clearLogs

  closure.then(js => {
    try {
      eval(js)
    } catch (error) {
      console.error(i("play_run_js_fail"))
      console.error(error)
    }

    allLogs = allLogs + "<hr />"

    // @ts-expect-error
    console["clear"] = console["oldclear"]
    undoLoggingFunc("log")
    undoLoggingFunc("debug")
    undoLoggingFunc("warn")
    undoLoggingFunc("error")
    undoLoggingFunc("info")
    undoLoggingFunc("clear")
  })

  function undoLoggingFunc(name: string) {
    // @ts-ignore
    console[name] = console["old" + name]
  }

  function fixLoggingFunc(name: string, id: string) {
    // @ts-ignore
    console["old" + name] = console[name]
    // @ts-ignore
    console[name] = function (...objs: any[]) {
      const output = produceOutput(objs)
      const eleLog = eleLocator()
      const prefix = '[<span class="log-' + name + '">' + id + "</span>]: "
      const eleContainerLog = eleOverflowLocator()
      allLogs = allLogs + prefix + output + "<br>"
      eleLog.innerHTML = allLogs
      const scrollElement = eleContainerLog.parentElement
      if (autoScroll && scrollElement) {
        scrollToBottom(scrollElement)
      }
      // @ts-ignore
      console["old" + name].apply(undefined, objs)
    }
  }

  function scrollToBottom(element: Element) {
    const overflowHeight = element.scrollHeight - element.clientHeight
    const atBottom = element.scrollTop >= overflowHeight
    if (!atBottom) {
      element.scrollTop = overflowHeight
    }
  }

  const objectToText = (arg: any): string => {
    const isObj = typeof arg === "object"
    let textRep = ""
    if (arg && arg.stack && arg.message) {
      // special case for err
      textRep = arg.message
    } else if (arg === null) {
      textRep = "<span class='literal'>null</span>"
    } else if (arg === undefined) {
      textRep = "<span class='literal'>undefined</span>"
    } else if (Array.isArray(arg)) {
      textRep = "[" + arg.map(objectToText).join("<span class='comma'>, </span>") + "]"
    } else if (typeof arg === "string") {
      textRep = '"' + arg + '"'
    } else if (isObj) {
      const name = arg.constructor && arg.constructor.name
      const prefix = name ? `${name}: ` : ""
      textRep = prefix + JSON.stringify(arg, null, 2)
    } else {
      textRep = arg as any
    }
    return textRep
  }

  function produceOutput(args: any[]) {
    return args.reduce((output: any, arg: any, index) => {
      const textRep = objectToText(arg)
      const showComma = index !== args.length - 1
      const comma = showComma ? "<span class='comma'>, </span>" : ""
      return output + textRep + comma + "&nbsp;"
    }, "")
  }
}

const addClearAction = (sandbox: Sandbox, ui: UI, i: any) => {
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

  sandbox.editor.addAction(clearLogsAction)
}
