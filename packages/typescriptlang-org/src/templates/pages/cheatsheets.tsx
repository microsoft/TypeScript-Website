import * as React from "react"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"
import { useIntl } from "react-intl";

import { cheatCopy } from "../../copy/en/cheatsheets"
import { createInternational } from "../../lib/createInternational";

import "./css/cheatsheets.scss"

type Props = {
  pageContext: any
}

const Index: React.FC<Props> = (props) => {
  const i = createInternational<typeof cheatCopy>(useIntl())

  return <Layout title={i("cht_layout_title")} description={i("cht_dl_subtitle")} lang={props.pageContext.lang}>
      <nav className="navbar-sub">
        <ul className="nav">
          <li className="name hide-small"><span>{i("cht_layout_title")}</span></li>
          <li className="nav-item">
            <a style={{padding: "0.95rem 0.5em 0.7em"}} href="/assets/typescript-cheat-sheets.zip" title="Download the zip file">{i("cht_download")}</a>
          </li>
          </ul>
      </nav>
    <div className="raised main-content-block cheatsheets">
     <h2 style={{ fontSize: "2.5rem", textAlign: "center" }}>{"TypeScript " + i("cht_layout_title")}</h2>
     <div className="row">
        <p >{i("cht_blurb_1")}</p>
        <p >{i("cht_blurb_2")}</p>
     </div>

     <div className="sheet-container">
        <a className="sheet cs-1" href={require("../../../static/images/cheatsheets/TypeScript Control Flow Analysis.png").default} title={i("cht_cfa") + " " + i("cht_layout_title")}>
            <img src={require("../../../static/images/cheatsheets/TypeScript Control Flow Analysis.png").default} alt="Control Flow Analysis Cheat Sheet" />
            <div className="description">{i("cht_cfa")}</div>
        </a>
        <a className="sheet cs-2" href={require("../../../static/images/cheatsheets/TypeScript Interfaces.png").default} title={i("cht_interfaces") + " " + i("cht_layout_title")}>
            <img src={require("../../../static/images/cheatsheets/TypeScript Interfaces.png").default} alt="Interfaces Cheat Sheet" />
            <div className="description">{i("cht_interfaces")}</div>

        </a>
        <a className="sheet cs-3" href={require("../../../static/images/cheatsheets/TypeScript Types.png").default} title={i("cht_types") + " " + i("cht_layout_title")}>
            <img src={require("../../../static/images/cheatsheets/TypeScript Types.png").default} alt="Types Cheat Sheet" />
            <div className="description">{i("cht_types")}</div>
        </a>
        <a className="sheet cs-4" href={require("../../../static/images/cheatsheets/TypeScript Classes.png").default} title={i("cht_classes") + " " + i("cht_layout_title")}>
            <img src={require("../../../static/images/cheatsheets/TypeScript Classes.png").default} alt="Classes Cheat Sheet" />
            <div className="description">{i("cht_classes")}</div>
        </a>

     </div>

        <FluidButton
            title={i("cht_dl_title")}
            subtitle={i("cht_dl_subtitle")}
            href="/assets/typescript-cheat-sheets.zip"
            onClick={() => event("Downloaded Cheat Sheet Zip", { link: "download" })}
            icon={
              <svg width="15" height="27" viewBox="0 0 15 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0.5V19M7.5 19L1 13M7.5 19L13 13" stroke="black" strokeWidth="1.5" />
                <path d="M0.5 25H14.5" stroke="black" strokeWidth="4" />
              </svg>
            } />
    </div>
  </Layout>
  }


export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>

const event = (name: string, options?: any) => {
    // @ts-ignore
    window.appInsights &&
      // @ts-ignore
      window.appInsights.trackEvent({ name }, options)
  }

const FluidButton = (props: { href?: string, onClick?: any, title: string, subtitle?: string, icon: JSX.Element, className?: string }) => (
    <a className={"fluid-button " + props.className || ""} href={props.href} onClick={props.onClick}>
      <div>
        <div className="fluid-button-title">{props.title}</div>
        <div className="fluid-button-subtitle">{props.subtitle}</div>
      </div>
      <div className="fluid-button-icon">
        {props.icon}
      </div>
    </a>
  )
  