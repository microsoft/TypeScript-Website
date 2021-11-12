type StoryContent =
  | { type: "html"; html: string; title: string }
  | { type: "href"; href: string; title: string }
  | { type: "code"; code: string; params: string; title: string }
  | { type: "hr" }

import type { Sandbox } from "typescriptlang-org/static/js/sandbox"
import type { UI } from "./createUI"

/**
 * Uses the Playground gist proxy to generate a set of stories ^ which 
 * correspond to files in the 
 */
export const gistPoweredNavBar = (sandbox: Sandbox, ui: UI, showNav: () => void) => {
  const gistHash = location.hash.split("#gist/")[1]
  const [gistID] = gistHash.split("-")

  // @ts-ignore
  window.appInsights && window.appInsights.trackEvent({ name: "Loaded Gist Playground", properties: { id: gistID } })

  sandbox.editor.updateOptions({ readOnly: true })
  ui.flashInfo(`Opening Gist ${gistID} as a Docset`, 2000)

  // Disable the handbook button because we can't have two sidenavs
  const handbookButton = document.getElementById("handbook-button")
  if (handbookButton) {
    handbookButton.parentElement!.classList.add("disabled")
  }

  const playground = document.getElementById("playground-container")!
  playground.style.opacity = "0.5"

  // const relay = "http://localhost:7071/api/API"
  const relay = "https://typescriptplaygroundgistproxyapi.azurewebsites.net/api/API"
  fetch(`${relay}?gistID=${gistID}`)
    .then(async res => {
      // Make editor work again
      playground.style.opacity = "1"
      sandbox.editor.updateOptions({ readOnly: false })

      const response = await res.json()
      if ("error" in response) {
        return ui.flashInfo(`Error with getting your gist: ${response.display}.`, 3000)
      }

      // If the API response is a single code file, just throw that in
      if (response.type === "code") {
        sandbox.setText(response.code)
        sandbox.setCompilerSettings(response.params)

        // If it's multi-file, then there's work to do
      } else if (response.type === "story") {
        showNav()
        const prefix = `#gist/${gistID}`
        updateNavWithStoryContent(response.title, response.files, prefix, sandbox)
      }
    })
    .catch(() => {
      ui.flashInfo("Could not reach the gist to playground API, are you (or it) offline?")
      playground.style.opacity = "1"
      sandbox.editor.updateOptions({ readOnly: false })
    })
}

/** Use the handbook TOC which is injected into the globals to create a sidebar  */
export const showNavForHandbook = (sandbox: Sandbox, escapeFunction: () => void) => {
  // @ts-ignore
  const content = window.playgroundHandbookTOC.docs

  const button = document.createElement("button")
  button.ariaLabel = "Close handbook"
  button.className = "examples-close"
  button.innerText = "Close"
  button.onclick = escapeFunction

  const story = document.getElementById("editor-container")
  story?.appendChild(button)
  updateNavWithStoryContent("Handbook", content, "#handbook", sandbox)

  const nav = document.getElementById("navigation-container")
  if (nav) nav.classList.add("handbook")
}

/** 
 * Hides the nav and the close button, specifically only when we have
 * the handbook open and not when a gist is open
 */
export const hideNavForHandbook = (sandbox: Sandbox) => {
  const nav = document.getElementById("navigation-container")
  if (!nav) return
  if (!nav.classList.contains("handbook")) return

  showCode(sandbox)
  nav.style.display = "none"

  const leftDrag = document.querySelector(".playground-dragbar.left") as HTMLElement
  if (leftDrag) leftDrag.style.display = "none"

  const story = document.getElementById("editor-container")
  const possibleButtonToRemove = story?.querySelector("button")
  if (story && possibleButtonToRemove) story.removeChild(possibleButtonToRemove)
}

/** 
 * Assumes a nav has been set up already, and then fills out the content of the nav bar
 * with clickable links for each potential story.
 */
const updateNavWithStoryContent = (title: string, storyContent: StoryContent[], prefix: string, sandbox: Sandbox) => {
  const nav = document.getElementById("navigation-container")
  if (!nav) return

  while (nav.firstChild) {
    nav.removeChild(nav.firstChild)
  }

  const titleh4 = document.createElement("h4")
  titleh4.textContent = title
  nav.appendChild(titleh4)

  // Make all the sidebar elements
  const ul = document.createElement("ul")
  storyContent.forEach((element: StoryContent, i: number) => {
    const li = document.createElement("li")
    switch (element.type) {
      case "html":
      case "href":
      case "code": {
        li.classList.add("selectable")
        const a = document.createElement("a")

        let logo: string
        if (element.type === "code") {
          logo = `<svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="7" height="7" fill="#187ABF"/></svg>`
        } else if (element.type === "html") {
          logo = `<svg width="9" height="11" viewBox="0 0 9 11" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5.5V3.25L6 1H4M8 5.5V10H1V1H4M8 5.5H4V1" stroke="#C4C4C4"/></svg>`
        } else {
          logo = ""
        }

        a.innerHTML = `${logo}${element.title}`
        a.href = `/play#${prefix}-${i}`

        a.onclick = e => {
          e.preventDefault()

          // Note: I'm not sure why this is needed?
          const ed = sandbox.editor.getDomNode()
          if (!ed) return
          sandbox.editor.updateOptions({ readOnly: false })

          const alreadySelected = ul.querySelector(".selected") as HTMLElement
          if (alreadySelected) alreadySelected.classList.remove("selected")

          li.classList.add("selected")
          switch (element.type) {
            case "code":
              setCode(element.code, sandbox)
              break;
            case "html":
              setStory(element.html, sandbox)
              break;
            case "href":
              setStoryViaHref(element.href, sandbox)
              break;
          }

          // Set the URL after selecting
          const alwaysUpdateURL = !localStorage.getItem("disable-save-on-type")
          if (alwaysUpdateURL) {
            location.hash = `${prefix}-${i}`
          }
          return false
        }
        li.appendChild(a)

        break
      }
      case "hr": {
        const hr = document.createElement("hr")
        li.appendChild(hr)
      }
    }
    ul.appendChild(li)
  })
  nav.appendChild(ul)

  const pageID = location.hash.split("-")[1] || ""
  const index = Number(pageID) || 0

  const targetedLi = ul.children.item(index) || ul.children.item(0)
  if (targetedLi) {
    const a = targetedLi.getElementsByTagName("a").item(0)
    // @ts-ignore
    if (a) a.click()
  }
}

// Use fetch to grab the HTML from a URL, with a special case 
// when that is a gatsby URL where we pull out the important
// HTML from inside the __gatsby id.
const setStoryViaHref = (href: string, sandbox: Sandbox) => {
  fetch(href).then(async req => {
    if (req.ok) {
      const text = await req.text()

      if (text.includes("___gatsby")) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, "text/html");

        const gatsby = doc.getElementById('___gatsby')
        if (gatsby) {
          gatsby.id = "___inner_g"
          setStory(gatsby, sandbox)
        }
        return
      }

      if (document.location.host === "localhost:8000") {
        setStory("<p>Because the gatsby dev server uses JS to build your pages, and not statically, the page will not load during dev. It does work in prod though - use <code>yarn build-site</code> to test locally with a static build.</p>", sandbox)
      } else {
        setStory(text, sandbox)
      }
    } else {
      setStory(`<p>Failed to load the content at ${href}. Reason: ${req.status} ${req.statusText}</p>`, sandbox)
    }
  })
}

/** 
 * Passing in either a root HTML element or the HTML for the story, present a 
 * markdown doc as a 'story' inside the playground.
 */
const setStory = (html: string | HTMLElement, sandbox: Sandbox) => {
  const toolbar = document.getElementById("editor-toolbar")
  if (toolbar) toolbar.style.display = "none"

  const monaco = document.getElementById("monaco-editor-embed")
  if (monaco) monaco.style.display = "none"

  const story = document.getElementById("story-container")
  if (!story) return

  story.style.display = "block"
  if (typeof html === "string") {
    story.innerHTML = html
  } else {
    while (story.firstChild) {
      story.removeChild(story.firstChild)
    }
    story.appendChild(html)
  }

  // We need to hijack internal links
  for (const a of Array.from(story.getElementsByTagName("a"))) {
    if (!a.pathname.startsWith("/play")) continue
    // Note the the header generated links also count in here

    // overwrite playground links
    if (a.hash.includes("#code/")) {
      a.onclick = e => {
        const code = a.hash.replace("#code/", "").trim()
        let userCode = sandbox.lzstring.decompressFromEncodedURIComponent(code)
        // Fallback incase there is an extra level of decoding:
        // https://gitter.im/Microsoft/TypeScript?at=5dc478ab9c39821509ff189a
        if (!userCode) userCode = sandbox.lzstring.decompressFromEncodedURIComponent(decodeURIComponent(code))
        if (userCode) setCode(userCode, sandbox)

        e.preventDefault()

        const alreadySelected = document.getElementById("navigation-container")!.querySelector("li.selected") as HTMLElement
        if (alreadySelected) alreadySelected.classList.remove("selected")
        return false
      }
    }

    // overwrite gist/handbook links
    else if (a.hash.includes("#gist/") || a.hash.includes("#handbook")) {
      a.onclick = e => {
        const index = Number(a.hash.split("-")[1])
        const nav = document.getElementById("navigation-container")
        if (!nav) return
        const ul = nav.getElementsByTagName("ul").item(0)!

        const targetedLi = ul.children.item(Number(index) || 0) || ul.children.item(0)
        if (targetedLi) {
          const a = targetedLi.getElementsByTagName("a").item(0)
          // @ts-ignore
          if (a) a.click()
        }
        e.preventDefault()
        return false
      }
    } else {
      a.setAttribute("target", "_blank")
    }
  }
}

const showCode = (sandbox: Sandbox) => {
  const story = document.getElementById("story-container")
  if (story) story.style.display = "none"

  const toolbar = document.getElementById("editor-toolbar")
  if (toolbar) toolbar.style.display = "block"

  const monaco = document.getElementById("monaco-editor-embed")
  if (monaco) monaco.style.display = "block"

  sandbox.editor.layout()
}

const setCode = (code: string, sandbox: Sandbox) => {
  sandbox.setText(code)
  showCode(sandbox)
}