export const setupFileTree = (container: HTMLElement, editor: import("monaco-editor").editor.IStandaloneCodeEditor) => {
  const Tree = window.require("vs/base/parts/tree/browser/treeImpl").Tree

  const treeConfig = createTreeConfig()
  // @ts-ignore
  treeConfig.controller = createController(
    { container },
    () => [],
    () => 600
  )
  const tree = new Tree(container, treeConfig)
  tree.model.setInput(generateDirectoryTree(directoryListing))
  console.log(tree)
  console.log(tree.model)

  return {
    tree,
  }
}

export function getController(
  target: { container: HTMLElement },
  getActionsFn: (file: any, event: any) => [],
  resolveMenuHeight?: (event: any) => number
) {
  const { IContextViewService } = window.require("vs/platform/contextview/browser/contextView")
  const { ITelemetryService } = window.require("vs/platform/telemetry/common/telemetry")
  const { IThemeService } = window.require("vs/platform/theme/common/themeService")
  const { IKeybindingService } = window.require("vs/platform/keybinding/common/keybinding")
  const { INotificationService } = window.require("vs/platform/notification/common/notification")
  const { ContextMenuService } = window.require("vs/platform/contextview/browser/contextMenuService")
  const { DynamicStandaloneServices } = window.require("vs/editor/standalone/browser/standaloneServices")
  const { DefaultController } = window.require("vs/base/parts/tree/browser/treeDefaults")

  const services = new DynamicStandaloneServices(target.container, {})

  const telemetryService = services.get(ITelemetryService)
  const notificationService = services.get(INotificationService)
  const contextViewService = services.get(IContextViewService)
  const keybindingService = services.get(IKeybindingService)

  const themeService = services.get(IThemeService)
  themeService.setTheme("vs-dark")

  const contextMenuService = new ContextMenuService(
    telemetryService,
    notificationService,
    contextViewService,
    keybindingService,
    themeService
  )

  return class Controller extends DefaultController {
    onContextMenu(tree: any, file: any, event: any) {
      tree.setFocus(file)
      const anchorOffset = { x: -10, y: -3 }
      const anchor = { x: event._posx + anchorOffset.x, y: event._posy + anchorOffset.y }
      const actions = getActionsFn && getActionsFn(file, event)
      if (!actions || !actions.length) {
        return false
      }

      contextMenuService.showContextMenu({
        getAnchor: () => anchor,
        getActions: () => actions || [],
        getActionItem: () => null,
        onHide: (wasCancelled: boolean) => {
          if (wasCancelled) {
            tree.domFocus()
          }
        },
      })
      super.onContextMenu(tree, file, event)
      if (resolveMenuHeight) {
        this.resolveMenuHeight(event)
      }

      return true
    }
    // resolveMenuHeight() {}
  }
}

export function createController(
  target: { container: HTMLElement },
  getActionsFn: (file: any, event: any) => [],
  resolveMenuHeight?: (event: any) => number
) {
  const Controller = getController(target, getActionsFn, resolveMenuHeight)
  return new Controller()
}

const createTreeConfig = () => ({
  dataSource: {
    /**
     * Returns the unique identifier of the given element.
     * No more than one element may use a given identifier.
     */
    getId: function (tree: any, element: TreeNode) {
      return element.key
    },

    /**
     * Returns a boolean value indicating whether the element has children.
     */
    hasChildren: function (tree: any, element: TreeNode) {
      return element.isDirectory
    },

    /**
     * Returns the element's children as an array in a promise.
     */
    getChildren: function (tree: any, element: TreeNode) {
      return Promise.resolve(element.children)
    },

    /**
     * Returns the element's parent in a promise.
     */
    getParent: function (tree: any, element: TreeNode) {
      return Promise.resolve(element.parent)
    },
  },
  renderer: {
    getHeight: function (tree: any, element: TreeNode) {
      return 24
    },
    renderTemplate: function (tree: any, templateId: string, container: HTMLElement) {
      return new FileTemplate(container)
    },
    renderElement: function (tree: any, element: any, templateId: string, templateData: any) {
      templateData.set(element)
    },
    disposeTemplate: function (tree: any, templateId: string, templateData: any) {
      // FileTemplate.dispose()
    },
  },

  //tree config requires a controller property but we would defer its initialisation
  //to be done by the MonacoTree component
  //controller: createController(this, this.getActions.bind(this), true),
  // dnd: new TreeDnD(),
})

class TreeNode {
  children: TreeNode[]
  constructor(public key: string, public name: string, public isDirectory: boolean, public parent: TreeNode | null) {
    this.children = []
  }

  get path(): string {
    //if this is the rootnode (this.parent == null) then just return empty string
    //we don't need the rootnode's name appearing in the path of its children
    if (this.parent == null) return ""

    const parentPath = this.parent.path

    return parentPath === "" ? this.name : parentPath + "/" + this.name
  }

  isDescendantOf(treeNode: TreeNode) {
    let parent = this.parent
    while (parent) {
      if (parent === treeNode) {
        return true
      }
      parent = parent.parent
    }
    return false
  }
}

export class Template {
  monacoIconLabel: HTMLElement
  label: HTMLElement
  description: HTMLElement

  constructor(container: HTMLElement) {
    this.monacoIconLabel = document.createElement("div")
    this.monacoIconLabel.className = "monaco-icon-label"
    this.monacoIconLabel.style.display = "flex"
    container.appendChild(this.monacoIconLabel)

    const labelDescriptionContainer = document.createElement("div")
    labelDescriptionContainer.className = "monaco-icon-label-description-container"
    this.monacoIconLabel.appendChild(labelDescriptionContainer)

    this.label = document.createElement("a")
    this.label.className = "label-name"
    labelDescriptionContainer.appendChild(this.label)

    labelDescriptionContainer.style.overflow = "hidden"
    labelDescriptionContainer.style.textOverflow = "ellipsis"
    labelDescriptionContainer.style.whiteSpace = "nowrap"

    this.description = document.createElement("span")
    this.description.className = "label-description"
    labelDescriptionContainer.appendChild(this.description)
  }
}

export class FileTemplate extends Template {
  constructor(container: HTMLElement) {
    super(container)
  }

  dispose() {
    // TODO dispose resources?
  }

  /**
   *Set the file
   *
   * @param {TreeNode} file file node
   * @memberof FileTemplate
   */
  set(file: TreeNode) {
    //first reset the class name
    this.monacoIconLabel.className = "monaco-icon-label"
    this.monacoIconLabel.classList.remove("file-icon")

    const icon = "json" //getFileIconLabel(file.name, file.isDirectory)

    if (!file.isDirectory) {
      this.monacoIconLabel.classList.add("file-icon")
    }

    if (icon) {
      this.monacoIconLabel.classList.add(icon)
    }

    this.label.innerHTML = file.name
    this.monacoIconLabel.title = file.path
  }
}

/**
 * Generate the directory tree objects based on the passed directory file entries
 */
export function generateDirectoryTree(entries: string[] = [], root = "root") {
  //first sort the entries alphabetically
  entries.sort(function (a, b) {
    a = a.toLowerCase() // ignore upper and lowercase
    b = b.toLowerCase() // ignore upper and lowercase

    if (a < b) return -1

    if (a > b) return 1

    return 0
  })

  let currentKey = 1

  const rootNode = new TreeNode(`${currentKey}`, root, true, null)

  //create the folders
  entries.forEach(pathStr => {
    const pathArr = pathStr.split("/")

    const pathLen = pathArr.length

    let current = rootNode

    for (let i = 0; i < pathLen; i++) {
      let name = pathArr[i]

      let index = i

      // If the child node doesn't exist, create it
      let child = current.children.find(el => el.name === name)

      if (child === undefined && index < pathLen - 1) {
        currentKey = currentKey += 1
        child = new TreeNode(`${currentKey}`, name, true, current)

        current.children.push(child)
      }

      // make child the current tree node
      current = child!
    }
  })

  //create the files
  entries.forEach(pathStr => {
    const pathArr = pathStr.split("/")

    const pathLen = pathArr.length

    let current = rootNode

    if (pathLen === 1) {
      let name = pathArr[0]

      currentKey = currentKey += 1

      let node = new TreeNode(`${currentKey}`, name, false, current)

      current.children.push(node)

      return
    }

    // Loop through the path to add files
    pathArr.forEach((name, index) => {
      // If the child node doesn't exist, create it
      let child = current.children.find(el => el.name === name)

      if (child === undefined && index === pathLen - 1) {
        currentKey = currentKey += 1

        child = new TreeNode(`${currentKey}`, name, false, current)

        current.children.push(child)
      } else if (child === undefined) {
        return
      } else {
        // make child the current tree node
        current = child
      }
    })
  })

  return rootNode
}

const directoryListing = [
  "changelog.txt",
  "debug.js",
  "license.txt",
  "package.json",
  "readme.md",
  "release.js",
  "controllers/api.js",
  "controllers/chat.js",
  "controllers/default.js",
  "databases/channels.json",
  "databases/users.json",
  "definitions/auth.js",
  "definitions/convertors.js",
  "definitions/globals.js",
  "definitions/helpers.js",
  "definitions/localization.js",
  "definitions/merge.js",
  "definitions/operations.js",
  "definitions/scheduler.js",
  "models/account.js",
  "models/channels.js",
  "models/favorites.js",
  "models/login.js",
  "models/messages.js",
  "models/tasks.js",
  "models/users.js",
  "public/favicon.ico",
  "public/icon.png",
  "views/index.html",
  "views/login.html",
  "views/notification.html",
  "public/css/bootstrap.min.css",
  "public/css/default.css",
  "public/css/ui.css",
  "public/forms/files.html",
  "public/forms/formblacklist.html",
  "public/forms/formchannel.html",
  "public/forms/formuser.html",
  "public/forms/help.html",
  "public/img/preloader.gif",
  "public/photos/face.jpg",
  "public/js/default.js",
  "public/js/jctajr.min.js",
  "public/js/ui.js",
  "public/templates/chat.html",
  "public/templates/favorite.html",
  "public/templates/settings.html",
  "public/templates/tasks.html",
  "public/templates/users.html",
]
