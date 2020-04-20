import * as React from "react"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"
import { graphql } from "gatsby"
import { EmptyPageQuery } from "../../__generated__/gatsby-types"

type Props = {
  pageContext: any
  data: EmptyPageQuery
}

const Index: React.FC<Props> = (props) =>
  <Layout title="NO-OP" description="This page is intentionally left empty" lang={props.pageContext.lang} allSitePage={props.data.allSitePage}>
    <div className="raised main-content-block">
      <p>This page is intentionally left blank</p>
    </div>
  </Layout>


export const query = graphql`
  query EmptyPage {
    ...AllSitePage
  }
`


export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>
