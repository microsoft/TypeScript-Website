import React from "react"
import { withPrefix } from "gatsby"

export type Props = {
  href: string
  blurb: string
  title: string
  headline?: true
  badge?: string
}

/** A pretty grey button */
export const GreyButton = (props: Props) => {
  const href = props.href.startsWith("http") ? props.href : withPrefix(props.href)
  return <a key={props.title} href={href} className={props.headline ? "headline clicky-grey-button" : "clicky-grey-button"}>
    <p>{props.blurb}</p>
    <h4>{props.title}</h4>
  </a>
}
