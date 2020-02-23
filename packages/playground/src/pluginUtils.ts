import type { Sandbox } from 'typescript-sandbox'
import type { Node } from "typescript"

/** Creates a set of util functions which is exposed to Plugins to make it easier to build consistent UIs */
export const createUtils = (sb: any) => {
  const sandbox: Sandbox = sb 
  const ts = sandbox.ts

  const requireURL = (path: string) => {
    // https://unpkg.com/browse/typescript-playground-presentation-mode@0.0.1/dist/x.js => unpkg/browse/typescript-playground-presentation-mode@0.0.1/dist/x
    const isDev = document.location.host.includes('localhost')
    const prefix = isDev ? 'local/' : 'unpkg/typescript-playground-presentation-mode/dist/'
    return prefix + path
  }

  const el = (str: string, el: string, container: Element) => {
    const para = document.createElement(el)
    para.innerHTML = str
    container.appendChild(para)
  }

  const createASTTree = (node: Node) => {
    const div = document.createElement('div')
    div.className = "ast"

    const infoForNode = (node: Node) => {
      const name = ts.SyntaxKind[node.kind]
      return {
        name,
      }
    }

    const renderLiteralField = (key: string, value: string) => {
      const li = document.createElement('li')
      li.innerHTML = `${key}: ${value}`
      return li
    }

    const renderSingleChild = (key: string, value: Node) => {
      const li = document.createElement('li')
      li.innerHTML = `${key}: <strong>${ts.SyntaxKind[value.kind]}</strong>`
      return li
    }

    const renderManyChildren = (key: string, value: Node[]) => {
      const li = document.createElement('li')
      const nodes = value.map(n => "<strong>&nbsp;&nbsp;" + ts.SyntaxKind[n.kind] + "<strong>").join("<br/>") 
      li.innerHTML = `${key}: [<br/>${nodes}</br>]`
      return li
    }
  
    const renderItem = (parentElement: Element, node: Node) => {
      const ul = document.createElement('ul')
      parentElement.appendChild(ul)
      ul.className = 'ast-tree'

      const info = infoForNode(node)
  
      const li = document.createElement('li')
      ul.appendChild(li)
  
      const a = document.createElement('a')
      a.textContent = info.name 
      li.appendChild(a)
  
      const properties = document.createElement('ul')
      properties.className = 'ast-tree'
      li.appendChild(properties)

      Object.keys(node).forEach(field => {
        if (typeof field === "function") return
        if (field === "parent" || field === "flowNode") return

        const value = (node as any)[field] 
        if (typeof value === "object" && Array.isArray(value) && "pos" in value[0] && "end" in value[0]) {
          //  Is an array of Nodes
          properties.appendChild(renderManyChildren(field, value))
        } else if (typeof value === "object" && "pos" in value && "end" in value) {
          // Is a single child property
          properties.appendChild(renderSingleChild(field, value))
        } else {
          properties.appendChild(renderLiteralField(field, value))
        }
      })  
    }
  
    renderItem(div, node)
    return div
  }


  return {
    /** Use this to make a few dumb element generation funcs */    
    el,
    /** Get a relative URL for something in your dist folder depending on if you're in dev mode or not */
    requireURL,
    /** Returns a div which has an interactive AST a TypeScript AST by passing in the root node */
    createASTTree
  }
}

export type PluginUtils = ReturnType<typeof createUtils>
