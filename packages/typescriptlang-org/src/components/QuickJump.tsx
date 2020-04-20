import * as React from "react"
import { useIntl } from "react-intl"
import { Intl } from "../components/Intl"
import { createInternational } from "../lib/createInternational"
import { docCopy } from "../copy/en/documentation"
import { AllSitePage, createIntlLink } from "./IntlLink";

export type Props = {
  allSitePage: AllSitePage
  lang: string
}
export const QuickJump = (props: Props) => {

  const intl = useIntl()
  const i = createInternational<typeof docCopy>(intl)
  i

  const IntlLink = createIntlLink(props.lang, props.allSitePage)

  return <div className="main-content-block">
    <h2 style={{ textAlign: "center" }}>Quick Jump</h2>
    <div className="columns">
      <div className="item raised">
        <h4>Get Started</h4>
        <ul>
          <li><IntlLink to="#">New to JS</IntlLink></li>
          <li><IntlLink to="#">JS to TS</IntlLink></li>
          <li><IntlLink to="#">OOP to JS</IntlLink></li>
          <li><IntlLink to="#">Functional to JS</IntlLink></li>
          <li><IntlLink to="#">Installation</IntlLink></li>
        </ul>
      </div>


      <div className="item raised">
        <h4>Handbook</h4>
        <ul>
          <li><IntlLink to="#">Basic Types</IntlLink></li>
          <li><IntlLink to="#">Advanced Types</IntlLink></li>
          <li><IntlLink to="#">Interfaces</IntlLink></li>
          <li><IntlLink to="#">Variable Declarations</IntlLink></li>
          <li><IntlLink to="#">Functions</IntlLink></li>
        </ul>
      </div>

      <div className="item raised">
        <h4>Tools</h4>
        <ul>
          <li><IntlLink to="#">Playground</IntlLink></li>
          <li><IntlLink to="#">TSConfig Reference</IntlLink></li>
        </ul>
        <h4 style={{ marginTop: "28px" }}>Release Notes</h4>
        <ul>
          <li><IntlLink to="#">What's new in the 3.9 beta</IntlLink></li>
          <li><IntlLink to="#">What's new in 3.8</IntlLink></li>
        </ul>
      </div>

      <div className="item raised">
        <h4>Tutorials</h4>
        <ul>
          <li><IntlLink to="#">ASP.NET</IntlLink></li>
          <li><IntlLink to="#">Migrating from JS</IntlLink></li>
          <li><IntlLink to="#">Working with the DOM</IntlLink></li>
          <li><IntlLink to="#">React & Webpack</IntlLink></li>
        </ul>
      </div>
    </div>
  </div>
}
