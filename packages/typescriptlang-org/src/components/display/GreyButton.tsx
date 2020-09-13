import * as React from "react"
import { withPrefix } from "gatsby"

export type Props = {
  href: string
  blurb: string
  title: string
  headline?: true
  badge?: string
  first?: boolean
  last?: boolean
  customClass?: string
}

/** A pretty grey button */
export const GreyButton = (props: Props) => {
  const href = props.href.startsWith("http")
    ? props.href
    : withPrefix(props.href)
  const classes = ["clicky-grey-button"]

  if (props.headline) classes.push("headline")
  if (props.first) classes.push("first")
  if (props.last) classes.push("last")
  if (props.customClass) classes.push(props.customClass)

  return (
    <a key={props.title} href={href} className={classes.join(" ")}>
      <p>{props.blurb}</p>
      <div>{props.title}</div>
    </a>
  )
}
