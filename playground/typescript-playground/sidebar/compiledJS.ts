import { PlaygroundPlugin } from "..";

export const compiledJSPlugin = () => {
  let codeElement: HTMLElement;

  const plugin: PlaygroundPlugin =  {
    displayName: "JS",
    willMount: (sandbox, container) => {
      // TODO: Monaco?
      const createCodePre = document.createElement("pre")
      codeElement = document.createElement("code")

      createCodePre.appendChild(codeElement)
      container.appendChild(createCodePre)
    },
    modelChanged: async (sandbox, model) => {
      console.log("ok")
      codeElement.textContent = await sandbox.getRunnableJS()
    }
  }

  return plugin
}
