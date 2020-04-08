import React from "react"
import { Layout } from "../components/layout"
import { withPrefix, graphql, Link } from "gatsby"

import { Intl } from "../components/Intl"
import { UpcomingQuery, BrandingQuery } from "../__generated__/gatsby-types"
import { UpcomingReleaseMeta } from "../components/index/UpcomingReleaseMeta"
import { useIntl } from "react-intl"


import "./branding.scss"

type Props = {
  data: BrandingQuery
}

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>

const Index: React.FC<Props> = (props) => {


  return (
    <>
      <Layout title="Branding" description="Logos and design assets" lang="en" allSitePage={props.data.allSitePage}>
        <div id="branding">
          <h1>Branding</h1>
          <h2 className="subnav">Logos and design assets for TypeScript</h2>

          <div className="raised content main-content-block headline">
            <a href={withPrefix("/branding/typescript-design-assets.zip")}>
              <img src={withPrefix("images/branding/logo-grouping.svg")} style={{ maxWidth: "100%" }} />
              <p style={{ textAlign: "center" }}>Click to download the asset pack</p>
            </a>
          </div>

          <h2>Recommendations</h2>

          <Row className="main-content-block recommendations">
            <p style={{ flex: 1 }}>Please use the blue TypeScript mark above as the primary logo for TypeScript</p>
            <p style={{ flex: 1 }}>The “TS” is the logo is white, not transparent by default.</p>
            <p style={{ flex: 1 }}>There is a capital “S” in TypeScript, just like in JavaScript.</p>
            <p style={{ flex: 1 }}>Please don’t use this as the logo for your applications</p>
          </Row>

          <h2>Alternatives</h2>

          <div className="main-content-block">
            <Row>
              <div className="raised content main-content-block subheadline">
                <a href={withPrefix("/branding/typescript-design-assets.zip")}>
                  <img src={withPrefix("images/branding/two-colors.svg")} style={{ maxWidth: "100%", margin: "2rem 0" }} />
                </a>
                <p className="attached-bottom">Single color variant which has the “TS” cut out, useful for when you need a single color designs</p>
              </div>

              <div className="raised content main-content-block subheadline">
                <a href={withPrefix("/branding/typescript-design-assets.zip")}>
                  <img src={withPrefix("images/branding/two-longform.svg")} style={{ maxWidth: "100%", margin: "2rem 0" }} />
                </a>
                <p className="attached-bottom">Full lettermark version of the TypeScript logo. </p>
              </div>

            </Row>
          </div>

          <h2>Palette</h2>

          <div className="raised content main-content-block headline">
            <a href={withPrefix("/branding/typescript-design-assets.zip")}>
              <img src={withPrefix("images/branding/palette.svg")} style={{ maxWidth: "100%" }} />
            </a>
          </div>

          <div className="raised content main-content-block headline">
            <a href={withPrefix("/branding/typescript-design-assets.zip")}>
              <img src={withPrefix("images/branding/palette-bg.svg")} style={{ maxWidth: "100%" }} />
            </a>

          </div>
        </div>
      </Layout>
    </>
  )
}

export default (props: Props) => <Intl locale="en"><Index {...props} /></Intl>

export const query = graphql`
  query Branding {
    ...AllSitePage
  }
`
