import React from "react"
import { withPrefix } from "gatsby"

export type Props = {
  href: string
  blurb: string
  title: string
  headline?: true
  badge?: string
  first?: boolean
  last?: boolean
}

/** A pretty grey button */
export const GreyButton = (props: Props) => {
  const href = props.href.startsWith("http") ? props.href : withPrefix(props.href)
  const classes = ["clicky-grey-button"]

  if (props.headline) classes.push("headline")
  if (props.first) classes.push("first")
  if (props.last) classes.push("last")

  return <a key={props.title} href={href} className={classes.join(" ")}>
    <p>{props.blurb}</p>
    <h4>{props.title}</h4>
  </a>
}
