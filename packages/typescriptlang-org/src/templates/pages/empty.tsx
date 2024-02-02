import * as React from "react"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"

type Props = {
  pageContext: any
}

const Index: React.FC<Props> = (props) =>
  <Layout title="NO-OP" description="This page is intentionally left empty" lang={props.pageContext.lang}>
    <div className="raised main-content-block">
      <p>本页故意留空</p>
    </div>
  </Layout>


export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>
