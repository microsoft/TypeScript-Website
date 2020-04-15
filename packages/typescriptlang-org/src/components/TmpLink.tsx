import * as React from "react"

import { GatsbyLinkProps } from "gatsby";

export const Link = (props: GatsbyLinkProps<{}>) => {
  return <a {...props} href={props.to} />
}
