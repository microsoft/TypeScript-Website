import React from "react"

import { GatsbyLinkProps } from "gatsby";

export const TmpLink = (props: GatsbyLinkProps<{}>) => {
  return <a {...props} href={props.to} />
}
