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
        sandbox.editor.addAction(clearLogsAction);
        addedClearAction = true
      }

      const errorUL = document.createElement("div")
      errorUL.id = "log-container"
      container.appendChild(errorUL)

      const logs = document.createElement("div")
      logs.id = "log"
      logs.innerHTML = allLogs.join('<hr />')
      errorUL.appendChild(logs)

      const logToolsContainer = document.createElement("div")
      logToolsContainer.id = "log-tools"
      container.appendChild(logToolsContainer);

      const clearLogsButton = document.createElement("div")
      clearLogsButton.id = "clear-logs-button"
      clearLogsButton.innerHTML = cancelButtonSVG
      clearLogsButton.onclick = e => {
        e.preventDefault();
        clearLogsAction.run();
      }
      logToolsContainer.appendChild(clearLogsButton)

      const filterTextBox = document.createElement("input");
      filterTextBox.id = "filter-logs"
      filterTextBox.placeholder = i("play_sidebar_tools_filter_placeholder")
      filterTextBox.addEventListener("input", (e: any) => {
        const eleLog = document.getElementById("log")!
        console.log(allLogs)
        eleLog.innerHTML = allLogs.filter(log => log.substring(log.indexOf(":") + 1, log.indexOf("&nbsp;<br>")).includes(e.target.value)).join("<hr />")
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
  allLogs = [];
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
    bindLoggingFunc(replace, rawConsole, 'log', 'LOG')
    bindLoggingFunc(replace, rawConsole, 'debug', 'DBG')
    bindLoggingFunc(replace, rawConsole, 'warn', 'WRN')
    bindLoggingFunc(replace, rawConsole, 'error', 'ERR')
    replace['clear'] = clearLogs
    const console = Object.assign({}, rawConsole, replace)
    try {
      eval(js)
    } catch (error) {
      console.error(i("play_run_js_fail"))
      console.error(error)
    }
  })

  function bindLoggingFunc(obj: any, raw: any, name: string, id: string) {
    obj[name] = function (...objs: any[]) {
      const output = produceOutput(objs)
      const eleLog = eleLocator()
      const prefix = `[<span class="log-${name}">${id}</span>]: `
      const eleContainerLog = eleOverflowLocator()
      allLogs.push(`${prefix}${output}<br>`);
      eleLog.innerHTML = allLogs.join("<hr />")
      const scrollElement = eleContainerLog.parentElement
      if (autoScroll && scrollElement) {
        scrollToBottom(scrollElement)
      }
      raw[name](...objs)
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
    } else if (typeof arg === "symbol") {
      textRep = `<span class='literal'>${String(arg)}</span>`
    } else if (Array.isArray(arg)) {
      textRep = "[" + arg.map(objectToText).join("<span class='comma'>, </span>") + "]"
    } else if (typeof arg === "string") {
      textRep = '"' + arg + '"'
    } else if (isObj) {
      const name = arg.constructor && arg.constructor.name
      // No one needs to know an obj is an obj
      const nameWithoutObject = name && name === "Object" ? "" : name
      const prefix = nameWithoutObject ? `${nameWithoutObject}: ` : ""
      textRep = prefix + JSON.stringify(arg, null, 2)
    } else {
      textRep = String(arg)
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