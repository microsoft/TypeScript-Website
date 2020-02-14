import React from "react"
import { Layout } from "../components/layout"
import { Intl } from "../components/Intl"
import { graphql } from "gatsby"

const Index = () =>
  <Layout title="NO-OP" description="This page is intentionally left empty" lang="en" allSitePage={props.data.allSitePage}>
    <div className="raised main-content-block">
      <p>This page is intentionally left blank</p>
    </div>
  </Layout>


export const query = graphql`
  query {
    ...AllSitePage
  }
`


export default (props: any) => <Intl><Index {...props} /></Intl>
