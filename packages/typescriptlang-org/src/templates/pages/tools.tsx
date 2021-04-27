import * as React from "react"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"

type Props = {
  pageContext: any
}

import "./css/tools.scss"
import { createIntlLink } from "../../components/IntlLink"
import { DevNav } from "../../components/devNav"

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>
const Col = (props: { children: any, className?: string }) => <div className={[props.className, "col1"].join(" ")}>{props.children}</div>


const Index: React.FC<Props> = (props) => {
  const Link = createIntlLink(props.pageContext.lang)

  return <Layout title="Reference Tools" description="Online tooling to help you understand TypeScript" lang={props.pageContext.lang}>
    <div className="raised main-content-block">
      <Row>
        <Col>
          <a className="cropper" href="../play/">
            <img src={require("../../../static/images/tools/play.png").default} alt="Preview of the TypeScript Playground screenshot" />
            <p>Playground</p>
          </a>
          <p>A live environment for exploring, learning and sharing TypeScript code. Try different compiler flags, run through extensive code samples to learn specifics about how TypeScript works.</p>
        </Col>
        <Col>
          <Link className="cropper" to="/tsconfig">
            <img src={require("../../../static/images/tools/tsconfig-ref.png").default} alt="Preview of the TypeScript TSConfig Reference screenshot" />
            <p>TSConfig Reference</p>
          </Link>
          <p>An annotated reference to more than a hundred compiler options available in a <code>tsconfig.json</code> or <code>jsconfig.json</code>.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <a className="cropper" href="../dt/search">
            <img src={require("../../../static/images/tools/dt-search.png").default} alt="Preview of the Definitely Typed search" />
            <p>Type Search</p>
          </a>
          <p>Search for npm modules with types from DefinitelyTyped or embedded in the module.</p>
        </Col>
        <Col>&nbsp;</Col>
      </Row>
    </div>

    <div className="raised main-content-block" style={{ paddingBottom: "0.4rem" }}>
      <DevNav />
    </div>
  </Layout>

}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>
