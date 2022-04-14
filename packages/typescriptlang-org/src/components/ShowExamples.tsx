import React, { useEffect } from "react"
import { withPrefix } from "gatsby"
import "./ShowExamples.scss"

// @ts-ignore - this is a fallback to english
import english from "../../static/js/examples/en"
import { hasLocalStorage } from "../lib/hasLocalStorage"

interface SamplesJSON {
  sections: { name: string, subtitle: string, id?: string }[]
  sortedSubSections: string[]
  examples: { path: string, title: string, name: string, id: string, sortIndex: number, hash: string, compilerSettings: any }[]
}
type Example = SamplesJSON["examples"][0]

const sortedSectionsDictionary = (locale: SamplesJSON, section: SamplesJSON["sections"][0]) => {
  const sectionDict = {}
  locale.examples.forEach(e => {
    // Allow switching a "-" to "." so that titles can have
    // a dot for version numbers, this own works once.
    if (e.path[0] === section.name.replace(".", "-") || e.path[0] === section.id) {
      if (sectionDict[e.path[1]]) {
        sectionDict[e.path[1]].push(e)
      } else {
        sectionDict[e.path[1]] = [e]
      }
    }

  })
  return sectionDict
}

const hrefForExample = (example: Example, lang: string) => {
  const isJS = example.name.indexOf(".js") !== -1
  const prefix = isJS ? "useJavaScript=true" : ""
  const hash = "example/" + example.id
  const params = example.compilerSettings || {}
  params.q = Math.floor(Math.random() * 512)
  const queryParams = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  const langPrefix = lang === "en" ? "" : lang
  return withPrefix(`${langPrefix}/play/?${prefix + queryParams}#${hash}`)
}


const buttonOnClick = (id: string) => (e) => {
  const tappedButton = e.target
  const contentID = id
  const examplesParent = tappedButton.closest(".examples")

  const allSectionTitles = examplesParent.querySelectorAll(".section-name")
  const allSections = examplesParent.querySelectorAll(".section-content")

  // @ts-ignore
  for (const title of allSectionTitles) { title.classList.remove("selected") }
  tappedButton.classList.add("selected")

  // @ts-ignore
  for (const section of allSections) {
    section.style.display = "none"
    section.classList.remove("selected")
  }

  const sectionForButton = examplesParent.querySelectorAll(".button-" + contentID)[0] // document.getElementById(contentID)
  if (sectionForButton) {
    sectionForButton.style.display = "flex"
    sectionForButton.classList.add("selected")
  }

  if (e && e.stopPropagation) {
    e.stopPropagation()
  }
}

export type Props = {
  defaultSection: string
  sections: string[]

  locale?: string
  /** DI'd copy of the examples, or fallback to eng */
  examples?: typeof import("../../static/js/examples/en.json")
}

export const RenderExamples = (props: Props) => {

  useEffect(() => {
    // Update the dots after it's loaded and running in the client instead
    let seenExamples = {}

    if (hasLocalStorage) {
      const examplesFromLS = localStorage.getItem("examples-seen") || "{}"
      seenExamples = JSON.parse(examplesFromLS)
    }

    document.querySelectorAll(".example-indicator").forEach(e => {
      const id = e.getAttribute("data-id")
      if (id) {
        const seen = seenExamples[id]
        if (seen) {
          const hash = e.getAttribute("data-hash")
          e.classList.add(hash === seen ? "done" : "changed")
        }
      }
    })
  })

  const lang = props.locale || "en"
  const locale = props.examples || english
  const sections = props.sections.map(sectionID => locale.sections.find(localeSection => sectionID === localeSection.id) || english.sections.find(localeSection => sectionID === localeSection.id))
  return (
    <div className="examples">
      <ol role="tablist">
        {sections.map(section => {
          const startOpen = section.id === props.defaultSection
          const selectedClass = startOpen ? " selected" : ""
          return (
            <li key={section.name} role="tab">
              <button onClick={buttonOnClick(section.id.toLowerCase().replace(".", "-"))} className={"section-name button " + selectedClass} aria-selected={selectedClass.length ? "true" : "false"} >{section.name}</button>
            </li>
          )
        }
        )}
      </ol>

      {sections.map(section => {
        const sectionDict = sortedSectionsDictionary(locale, section)
        const subsectionNames = Object.keys(sectionDict).sort((lhs, rhs) => locale.sortedSubSections.indexOf(lhs) - locale.sortedSubSections.indexOf(rhs))
        const startOpen = section.id === props.defaultSection
        const style = startOpen ? {} : { display: "none" }

        return <div key={section.name} className={`section-content button-${section.id.toLowerCase().replace(".", "-")}`} style={style} role="tabpanel">
          <p style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: section.subtitle }} />

          {subsectionNames.map(sectionName => {
            const sectionExamples = sectionDict[sectionName].sort((lhs, rhs) => lhs.sortIndex - rhs.sortIndex) as Example[]

            return <div className="section-list" key={sectionName}>
              <h4>{sectionName}</h4>
              <ol>
                {sectionExamples.map(example =>
                  <li key={example.id}>
                    <a className="example-link" title={"Open the example: " + example.title} href={hrefForExample(example, lang)}>{example.title}</a>
                    <div className="example-indicator" data-id={example.id} data-hash={example.hash}></div>
                  </li>)
                }
              </ol>
            </div>
          })}
        </div>
      })}
    </div>)
}
