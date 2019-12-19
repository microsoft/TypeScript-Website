import React, { MouseEventHandler } from "react"
import { Link } from "gatsby"

export interface NavItem {
  title: string
  id: string
  directory: string
  index: string
  items: { id: string, title: string }[]
}

export type Props = {
  navItems: NavItem[]
  selectedID: string
}

import "./Sidebar.scss"
import { onAnchorKeyDown, onButtonKeydown } from "./Sidebar-keyboard"

const closedChevron = <svg fill="none" height="14" viewBox="0 0 9 14" width="9" xmlns="http://www.w3.org/2000/svg"><path d="m1 13 6-6-6-6" stroke="#000" strokeWidth="2" /></svg>
const openChevron = <svg fill="none" height="9" viewBox="0 0 14 9" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m1 1 6 6 6-6" stroke="#000" strokeWidth="2" /></svg>

export const getTagFromParents = (tag: string, root: { nodeName: string, parentElement: any }) => {
  let parent = root.parentElement
  while (parent.nodeName !== tag.toUpperCase()) {
    parent = parent.parentElement
    if (parent.nodeName === "BODY") throw new Error("Could not find parent LI for toggle ")
  }
  return parent as HTMLElement
}

const toggleNavigationSection: MouseEventHandler = (event) => {
  const li = getTagFromParents("li", event.target as any)
  const isOpen = li.classList.contains("open")
  if (isOpen) {
    li.classList.remove("open")
    li.classList.add("closed")

  } else {
    li.classList.remove("closed")
    li.classList.add("open")
  }
}

export const Sidebar = (props: Props) => {
  return (
    <nav id="sidebar">
      <ul>
        {props.navItems.map(navRoot => {
          const hostsSelected = navRoot.items.find(i => i.id === props.selectedID)
          const classes = [] as string[]

          if (hostsSelected) {
            classes.push("open")
            classes.push("highlighted")
          } else {
            classes.push("closed")
          }

          const opened = { "aria-expanded": "true", "aria-label": navRoot.title + " close" }
          const closed = { "aria-label": navRoot.title + " expand" }
          const aria = hostsSelected ? opened : closed

          return (
            <li className={classes.join(" ")} key={navRoot.id}>
              <button {...aria} onClick={toggleNavigationSection} onKeyDown={onButtonKeydown}>
                {navRoot.title}
                <span className="open">{openChevron}</span>
                <span className="closed">{closedChevron}</span>
              </button>

              <ul>
                {navRoot.items.map(item => {
                  const isSelected = item.id === props.selectedID
                  const aria: any = {}
                  if (isSelected) {
                    aria["aria-current"] = "page"
                    aria.className = "highlight"
                  }
                  const path = `/docs/${navRoot.directory}/${item.id}.html`

                  return <li key={item.id} {...aria}>
                    <Link to={path} onKeyDown={onAnchorKeyDown}>{item.title}</Link>
                  </li>
                })}

              </ul>
            </li>)
        })}
      </ul>
    </nav>

  )
}
