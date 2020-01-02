import React, { useEffect } from "react"
import "./ShowExamples.scss"

// @ts-ignore - TODO: This could prove troublesome in the future - perhaps it could be grabbed in the GraphQL? 
import english from "../../static/js/examples/en"

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

const hrefForExample = (example: Example) => {
  const isJS = example.name.indexOf(".js") !== -1
  const prefix = isJS ? "useJavaScript=true" : ""
  const hash = "example/" + example.id
  const params = example.compilerSettings || {}
  const queryParams = Object.keys(params).map(key => key + '=' + params[key]).join('&');
  return `/play/?${prefix + queryParams}#${hash}`
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
  locale?: string
  defaultSection: string
  sections: string[]

  /** DI'd copy of the examples, or fallback to eng */
  examples?: typeof import("../../static/js/examples/en.json")
}

export const RenderExamples = (props: Props) => {

  useEffect(() => {
    // Update the dots after it's loaded

    let seenExamples = {}
    if (localStorage) {
      const examplesFromLS = localStorage.getItem("examples-seen") || "{}"
      seenExamples = JSON.parse(examplesFromLS)
    }

    // exampleSeen.classList.add("example-indicator")
    // const seenHash = seenExamples[e.id]
    // if (seenHash) {
    //   const isSame = seenHash === e.hash
    //   exampleSeen.classList.add(isSame ? "done" : "changed")
    //   exampleSeen.title = isSame ? "Seen example already" : "Seen example, but sample has changed since"
    // }
    // seenExamples
  })


  const locale = props.examples || english
  const sections = locale.sections.filter(s => props.sections.includes(s.id))
  return (
    <div className="examples">
      <ol>
        {sections.map(section => {
          const startOpen = section.id === props.defaultSection
          const selectedClass = startOpen ? " selected" : ""
          return <li key={section.name}><button onClick={buttonOnClick(section.id.toLowerCase().replace(".", "-"))} className={"section-name button " + selectedClass} >{section.name}</button></li>
        }
        )}
      </ol>

      {sections.map(section => {
        const sectionDict = sortedSectionsDictionary(locale, section)
        const subsectionNames = Object.keys(sectionDict).sort((lhs, rhs) => locale.sortedSubSections.indexOf(lhs) - locale.sortedSubSections.indexOf(rhs))
        const startOpen = section.id === props.defaultSection
        const style = startOpen ? {} : { display: "none" }

        return <div key={section.name} className={`section-content button-${section.id.toLowerCase().replace(".", "-")}`} style={style}>
          <p style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: section.subtitle }} />

          {subsectionNames.map(sectionName => {
            const sectionExamples = sectionDict[sectionName].sort((lhs, rhs) => lhs.sortIndex - rhs.sortIndex) as Example[]

            return <div className="section-list" key={sectionName}>
              <h4>{sectionName}</h4>
              <ol>
                {sectionExamples.map(example =>
                  <li key={example.id}>
                    <a className="example-link" title={"Open the example: " + example.title} href={hrefForExample(example)}>{example.title}</a>
                    <div className="example-indicator" data-id={example.title} data-hash={example.hash}></div>
                  </li>)
                }
              </ol>
            </div>
          })}
        </div>
      })}
    </div>)
}
