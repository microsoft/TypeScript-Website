import * as React from "react"

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }

export const Link = (props: LinkProps) => {
  const { to, ...rest } = props
  return <a {...rest} href={to} />
}
