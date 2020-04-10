import React from "react"
import { Link } from "gatsby"

interface PageAttributionProps {
  i: (string) => string,
  IntlLink: typeof Link
}

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>


export const PageAttribution = (props: PageAttributionProps) => {


  return (
    <div className="whitespace-tight raised">
      <Row className="justify-between">
        <div className="hide-small vertical-line" />
      </Row>
    </div >
  )
}

const EmptyLink = () => <div className="prev-next"></div>

interface Section {
  data: { title: string, oneline: string, permalink: string }
  i: (string) => string,
  InltLink: typeof Link
  type: string
}
