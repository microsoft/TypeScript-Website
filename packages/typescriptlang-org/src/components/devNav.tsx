import * as React from "react"
import { withPrefix } from "gatsby"

interface DevNavProps {
  active?: string
}

export const DevNav = (props: DevNavProps) => {
  const isActive = (str) =>
    props.active && props.active.toLowerCase() === str ? "active" : ""

  return <nav className="navbar-sub dev-tools">
    <ul className="nav">
      <li className="name"><h3>Developer Tools</h3></li>
      <li style={{ display: "none" }}>
        <a className={isActive("compiler api")} href={withPrefix("/dev/compiler")}>Compiler API</a>
      </li>
      <li>
        <a className={isActive("sandbox")} href={withPrefix("/dev/sandbox")}>Sandbox</a>
      </li>
      <li>
        <a className={isActive("twoslash")} href={withPrefix("/dev/twoslash")}>Twoslash</a>
      </li>
      <li>
        <a className={isActive("typescript vfs")} href={withPrefix("/dev/typescript-vfs")}>TypeScript VFS</a>
      </li>
      <li>
        <a className={isActive("playground plugins")} href={withPrefix("/dev/playground-plugins")}>Playground Plugins</a>
      </li>
      <li>
        <a className={isActive("bug workbench")} href={withPrefix("/dev/bug-workbench")}>Bug Workbench</a>
      </li>
    </ul>
  </nav >
}
