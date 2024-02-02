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
          <a className="cropper" href="/play">
            <img src={require("../../../static/images/tools/play.png").default} alt="Preview of the TypeScript Playground screenshot" />
            <p>演练场</p>
          </a>
          <p>用于探索、学习和共享 TypeScript 代码的实时环境。你可以通过尝试不同的编译器标志，以及运行大量代码示例，以了解 TypeScript 工作的具体细节。</p>
        </Col>
        <Col>
          <Link className="cropper" to="/tsconfig">
            <img src={require("../../../static/images/tools/tsconfig-ref.png").default} alt="Preview of the TypeScript TSConfig Reference screenshot" />
            <p>TSConfig 参考</p>
          </Link>
          <p>针对 <code>tsconfig.json</code> 或 <code>jsconfig.json</code> 中可用的一百多个编译器选项的带注释参考。</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <a className="cropper" href="/cheatsheets">
            <img src={require("../../../static/images/tools/cheat-sheets.png").default} alt="Preview of the cheat sheets page" />
            <p>速查表</p>
          </a>
          <p>快速浏览常见 TypeScript 语法。</p>
        </Col>
      </Row>
    </div>

    <div className="raised main-content-block" style={{ paddingBottom: "0.4rem" }}>
      <DevNav />
    </div>
  </Layout>

}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>