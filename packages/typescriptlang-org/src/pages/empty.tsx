import React from "react"
import { Layout } from "../components/layout"
import { Intl } from "../components/Intl"

const Index = () =>
  <Layout title="NO-OP" description="This page is intentionally left empty" lang="en">
    <div className="raised" style={{ maxWidth: 960, margin: "1rem auto", padding: "2rem" }}>
      <p>This page is intentionally left blank</p>
    </div>
  </Layout>


export default (props: any) => <Intl><Index {...props} /></Intl>
