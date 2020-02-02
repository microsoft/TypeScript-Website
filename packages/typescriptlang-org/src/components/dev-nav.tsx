import React from "react"
import { withPrefix } from "gatsby"

export const DevNav = () => {
  return <nav className="navbar-sub">
    <ul className="nav">
      <li className="name"><span>Developer Tools</span></li>
      <li>
        <a href={withPrefix("/dev/compiler")}>Compiler API</a>
      </li>
      <li>
        <a href={withPrefix("/dev/sandbox")}>Sandbox</a>
      </li>
      <li>
        <a href={withPrefix("/dev/twoslash")}>Twoslash</a>
      </li>
      <li>
        <a href={withPrefix("/dev/playground-plugins")}>Playground Plugins</a>
      </li>
    </ul>
  </nav >
}
