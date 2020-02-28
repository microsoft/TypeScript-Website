import React from "react"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"
import { graphql, withPrefix } from "gatsby"
import { EmptyPageQuery } from "../../__generated__/gatsby-types"

type Props = {
  pageContext: any
  data: EmptyPageQuery
}

import "./css/tools.scss"
import { createIntlLink } from "../../components/IntlLink"

const QuarterOrHalfRow = (props: { children: any, className?: string }) => <div className={[props.className, "split-row"].join(" ")}>{props.children}</div>
const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>
const Col = (props: { children: any, className?: string }) => <div className={[props.className, "col1"].join(" ")}>{props.children}</div>
const Col2 = (props: { children: any, className?: string }) => <div className={[props.className, "col2"].join(" ")}>{props.children}</div>


const Index: React.FC<Props> = (props) => {
  const Link = createIntlLink(props.pageContext.lang, props.data.allSitePage)

  return <Layout title="Reference Tools" description="Online tooling to help you understand TypeScript" lang={props.pageContext.lang} allSitePage={props.data.allSitePage}>
    <div className="raised main-content-block">
      <Row>
        <Col>
          <Link className="cropper" to="/play">
            <img src={require("../../../static/images/tools/play.png")} alt="Preview of the TypeScript Playground screenshot" />
            <p>Playground</p>
          </Link>
          <p>A live environment for exploring, learning and sharing TypeScript code. Try different compiler flags, run through extensive code samples to learn specifics about how TypeScript works.</p>
        </Col>
        <Col>
          <Link className="cropper" to="/tsconfig">
            <img src={require("../../../static/images/tools/tsconfig-ref.png")} alt="Preview of the TypeScript TSConfig Reference screenshot" />
            <p>TSConfig Reference</p>
          </Link>
          <p>An annotated reference to more than a hundred compiler options available in a <code>tsconfig.json</code> or <code>jsconfig.json</code>.</p>
        </Col>
      </Row>
    </div>
  </Layout>

}
export const query = graphql`
  query ToolsPage {
      ...AllSitePage
    }
`


export default (props: Props) => <Intl><Index {...props} /></Intl>
