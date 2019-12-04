import React, { useEffect } from "react"

// @ts-ignore - TODO: This could prove troublesome in the future - perhaps it could be grabbed in the GraphQL? 
import english from "../../../../playground-examples/generated/en"

interface Props {
  lang: string
}

interface SamplesJSON {
  sections: { name: string, subtitle: string }[]
  sortedSubSections: string[]
  examples: { path: string, title: string, name: string, id: string, sortIndex: number, hash: string, compilerSettings: any }[]
}

type Example = SamplesJSON["examples"][0]

const sortedSectionsDictionary = (locale: SamplesJSON, sectionName: string) => {
  const sectionDict = {}
  locale.examples.forEach(e => {
    // Allow switching a "-" to "." so that titles can have
    // a dot for version numbers, this own works once.
    if (e.path[0] !== sectionName.replace(".", "-")) return;

    if (sectionDict[e.path[1]]) {
      sectionDict[e.path[1]].push(e)
    } else {
      sectionDict[e.path[1]] = [e]
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

const buttonOnClick = (e) => {
  const tappedButton = e.target 
  const contentID = tappedButton.textContent.toLowerCase()

  const allSectionTitles = document.querySelectorAll(".section-name")
  for (const title of allSectionTitles) { title.classList.remove("selected") }
  tappedButton.classList.add("selected")

  const allSections = document.querySelectorAll<HTMLElement>(".section-content")
  for (const section of allSections) {
    section.style.display = "none"
    section.classList.remove("selected")
  }

  const sectionForButton = document.getElementById(contentID)
  sectionForButton.style.display = "flex"
  sectionForButton.classList.add("selected")

  if (e && e.stopPropagation) {
    e.stopPropagation()
  }
}




export const PlaygroundSamples = (props: Props) => {
  const locale = english as SamplesJSON
  const defaultSection = "TypeScript"

  // This ensures that the popover only becomes available when JS is enabled

  useEffect(() => {
    // Only allow hoving on wider windows 
    const allowHover = window.innerWidth > 900
    if (!allowHover) return

    // Visually enable the popover icon
    const iconSpan = document.getElementsByClassName("footer-icon")[0] as HTMLElement
    iconSpan.style.display = "inline-block"

    // This is all that is needed for the mouse hover
    for (const element of document.getElementsByClassName("popover-container")){
      element.classList.add("allow-hover")
    }

    // This is used to handle tabbing
    const showPopover = () => {
      const popover = document.getElementById("playground-samples-popover")
      popover.style.visibility = "visible"  
      popover.style.opacity = "1"

      // When the popover is up, allow tabbing through all of the items to hide the popover
      popover.addEventListener("blur", (e) => {
        const element = e.relatedTarget as HTMLElement
        if (!element || element.tagName === "A" && !element.classList.contains("example-link")) {
          popover.style.visibility = "hidden"
        }
      }, true);
    }

    const triggerAnchor = document.getElementById("popover-trigger-anchor")
    triggerAnchor.onfocus = showPopover
  });

  return (
    <div id="playground-samples-popover" aria-hidden="true" aria-label="Code Samples Submenu">
      <div className="examples">
        <ol>
          {locale.sections.map(section => {
            const startOpen = section.name === defaultSection
            const selectedClass = startOpen ? " selected" : ""
            return <li key={section.name}><button onClick={buttonOnClick} className={"section-name button" + selectedClass} >{section.name}</button></li>
          }
          )}
        </ol>

        {locale.sections.map(section => {
          const sectionDict = sortedSectionsDictionary(locale, section.name)
          const subsectionNames = Object.keys(sectionDict).sort((lhs, rhs) => locale.sortedSubSections.indexOf(lhs) - locale.sortedSubSections.indexOf(rhs))
          const startOpen = section.name === defaultSection
          const style = startOpen ? {} : { display: "none" }

          return <div key={section.name} id={section.name.toLowerCase()} className="section-content" style={style}>
            <p style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: section.subtitle}}/>

            {subsectionNames.map(sectionName => {
              const sectionExamples = sectionDict[sectionName].sort((lhs, rhs) => lhs.sortIndex - rhs.sortIndex) as Example[]

              return <div className="section-list" key={sectionName}>
                <h4>{sectionName}</h4>
                <ol>
                  {sectionExamples.map(example => {

                    return (
                      <li key={example.id}>
                        <a className="example-link" title={"Open the example: " + example.title} href={hrefForExample(example)}>{example.title}</a>
                        <div className="example-indicator" data-id={example.title} data-hash={example.hash}></div>
                      </li>)
                  })}
                </ol>
              </div>
            })}
          </div>
        })}
      </div>
      <div className="arrow-down" />
    </div>)
}
