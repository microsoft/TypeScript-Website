import * as React from "react"
import { Layout } from "../components/layout"
import { withPrefix } from "gatsby"

import { Intl } from "../components/Intl"

import "./branding.scss"

type Props = {}

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>

const Index: React.FC<Props> = (props) => {
  return (
    <>
      <Layout title="Branding" description="Logos and design assets" lang="en" >
        <div id="branding">
          <h1>Branding</h1>
          <h2 className="subnav">Logos and design assets for TypeScript</h2>

          <div className="raised content main-content-block headline">
            <a href={withPrefix("/branding/typescript-design-assets.zip")}>
              <img src={withPrefix("images/branding/logo-grouping.svg")} style={{ maxWidth: "100%" }} alt="Examples of the logos" />
              <p style={{ textAlign: "center" }}>Click to download the asset pack</p>
            </a>
          </div>

          <h2>Recommendations</h2>

          <Row className="main-content-block recommendations">
            <p style={{ flex: 1 }}>Please use the blue TypeScript mark above as the primary logo for TypeScript.</p>
            <p style={{ flex: 1 }}>This is the right logo for blog posts, news articles, giveaway stickers and general marketing for yourself.</p>
            <p style={{ flex: 1 }}>The “TS” in the logo is white, not transparent by default.</p>
            <p style={{ flex: 1 }}>There is a capital “S” in TypeScript, just like in JavaScript.</p>
          </Row>

          <h2>Alternatives</h2>

          <div className="main-content-block">
            <Row>
              <div className="raised content main-content-block subheadline">
                <a href={withPrefix("/branding/typescript-design-assets.zip")} title="Download the design assets">
                  <img src={withPrefix("images/branding/two-colors.svg")} style={{ maxWidth: "100%", margin: "2rem 0" }}  alt="Examples of the logos as single colors" />
                </a>
                <p className="attached-bottom">Single color variant which has the “TS” cut out, useful for when you need a single color design.</p>
              </div>

              <div className="raised content main-content-block subheadline">
                <a href={withPrefix("/branding/typescript-design-assets.zip")} title="Download the design assets">
                  <img src={withPrefix("images/branding/two-longform.svg")} style={{ maxWidth: "100%", margin: "2rem 0" }} alt="Examples of the logos as long-form. e.g. saying 'TypeScript' and not 'TS'" />
                </a>
                <p className="attached-bottom">Full lettermark version of the TypeScript logo. </p>
              </div>
            </Row>
          </div>

          <h2>Palette</h2>

          <div className="raised content main-content-block headline">
            <a href={withPrefix("/branding/typescript-design-assets.zip")} title="Download the design assets">
              <img src={withPrefix("images/branding/palette.svg")} style={{ maxWidth: "100%" }} alt="Examples of the palette, you can get this in ASCII inside the design assets" />
            </a>
          </div>

          <div className="raised content main-content-block headline">
            <a href={withPrefix("/branding/typescript-design-assets.zip")} title="Download the design assets">
              <img src={withPrefix("images/branding/palette-bg.svg")} style={{ maxWidth: "100%" }}  alt="Examples of the palette, you can get this in ASCII inside the design assets" />
            </a>
          </div>


          <h2>Please Don't</h2>

          <Row className="main-content-block recommendations">
            <p style={{ flex: 1 }}>Use the TypeScript logos for your application/product.</p>
            <p style={{ flex: 1 }}>Modify the shape of the logos when used.</p>
            <p style={{ flex: 1 }}>Integrate the TypeScript logo into your application's logo.</p>
            <p style={{ flex: 1 }}>Name a product which implies TypeScript's endorsement of the product.</p>
          </Row>
        </div>
      </Layout>
    </>
  )
}

export default (props: Props) => <Intl locale="en"><Index {...props} /></Intl>

