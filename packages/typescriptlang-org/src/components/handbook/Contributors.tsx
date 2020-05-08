import React, { useEffect } from "react"
import { Link } from "gatsby"

import attribution from "../../../../handbook-v1/output/attribution.json"

interface ContributorsProps {
  i: (string) => string
  path: string
  lastEdited: string
}

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>

export const Contributors = (props: ContributorsProps) => {
  const attrPath = props.path.replace("/packages/handbook-v1/", "")
  const page = attribution[attrPath]

  // https://github.com/microsoft/TypeScript-Website/blob/v2/packages/handbook-v1/en/Advanced%20Types.md
  const reposRootURL = "https://github.com/microsoft/TypeScript-Website/blob/v2"
  const repopPageURL = reposRootURL + props.path

  useEffect(() => {
    // @ts-ignore
    const perf = window.performance || window.mozPerformance || window.msPerformance || window.webkitPerformance || {};
    const t = perf.timing || {};

    const start = t.navigationStart
    const end = t.loadEventEnd
    const loadTime = (end - start) / 1000

    const copy = document.querySelector('#page-loaded-time');
    if (copy) copy.innerHTML += "This page loaded in " + loadTime + " seconds.</p>";
  }, [])

  return (
    <div className="whitespace-tight raised">
      <Row className="justify-between">
        <div style={{ flex: 1 }}><p>The TypeScript docs are an open source project. Help us improve these pages <a href={repopPageURL}>by sending a Pull Request</a> ❤</p></div>
        <div className="hide-small vertical-line" />
        <div style={{ flex: 1 }}><p>Contributors to this page:<br /><Avatars data={page} /></p></div>
        <div className="hide-small vertical-line" />
        <div style={{ flex: 1 }}><p>{`Last updated: ${props.lastEdited}`}<br /><span id='page-loaded-time'></span></p></div>
      </Row>
    </div >
  )
}

const Avatars = (props: { data: typeof attribution["en/Advanced Types.md"] }) => {
  const showRest = props.data.total > props.data.top.length
  return <div>
    {props.data.top.map(t => {
      const grav = `http://gravatar.com/avatar/${t.gravatar}?s=24&&d=mp`
      const alt = `${t.name}  (${t.count})`
      return <img id={t.gravatar} src={grav} alt={alt} />
    })}
    {showRest && <div className=''>{props.data.total - props.data.top.length}</div>}
  </div>
}

const EmptyLink = () => <div className="prev-next"></div>

interface Section {
  data: { title: string, oneline: string, permalink: string }
  i: (string) => string,
  InltLink: typeof Link
  type: string
}

const LinkSection = (props: Section) =>
  <Link className="navigation-link" rel="prev" to={props.data.permalink}>
    <Row className={"prev-next " + props.type}>
      <div className="arrow">
        <svg width="11" height="14" viewBox="0 0 11 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 0V14L0 7.5L10.5 0Z" fill="#187ABF" />
        </svg>
      </div>

      <div className="nav-content">
        <header>{props.i("handb_" + props.type)}</header>
        <h3>{props.data.title}</h3>
        <p>{props.data.oneline}</p>
      </div>
    </Row>
  </Link >
