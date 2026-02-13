import * as React from "react"

interface NextPrevProps {
  prev: { title: string, oneline: string, permalink: string } | undefined
  next: { title: string, oneline: string, permalink: string } | undefined,
  i: (string) => string,
  IntlLink: any
}

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>


export const NextPrev = (props: NextPrevProps) => {
  if (!props.prev && !props.next) return null
  const prev = props.prev
  const next = props.next

  return (
    <div className="whitespace-tight raised">
      <Row className="justify-between">
        {!prev ? <EmptyLink /> : <LinkSection i={props.i} data={prev} InltLink={props.IntlLink} type="prev" />}
        <div className="hide-small vertical-line" />
        {!next ? <EmptyLink /> : <LinkSection i={props.i} data={next} InltLink={props.IntlLink} type="next" />}
      </Row>
    </div >
  )
}

const EmptyLink = () => <div className="prev-next"></div>

interface Section {
  data: { title: string, oneline: string, permalink: string }
  i: (string) => string,
  InltLink: any
  type: string
}

const LinkSection = (props: Section) =>
  <a className="navigation-link" rel={props.type} href={props.data.permalink}>
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
  </a>
