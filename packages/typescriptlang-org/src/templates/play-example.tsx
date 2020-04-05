import React, { useEffect } from "react"
import { Layout } from "../components/layout"
import { PlayExampleQuery } from "../__generated__/gatsby-types"

import "./play.scss"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { headCopy } from "../copy/en/head-seo"
import { Intl } from "../components/Intl"
import { withPrefix, graphql } from "gatsby";

type Props = {
  pageContext: {
    lang: string
    html: string
    name: string
    title: string
    redirectHref: string
  }
  data: PlayExampleQuery
}

const Play = (props: Props) => {
  const i = createInternational<typeof headCopy>(useIntl())
  useEffect(() => {
    // Keep this page around so it is indexed on search engines
    const isBot = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent)
    if (!isBot) {
      // @ts-ignore - this is allowed in the DOM
      document.location = withPrefix(props.pageContext.redirectHref)
    }
  }, [])

  return (
    <Layout title={i("playground_example_prefix") + props.pageContext.title} description={i("head_playground_description")} lang={props.pageContext.lang} allSitePage={props.data.allSitePage}>
      <div className="raised main-content-block" >
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px" }}>
          <p dangerouslySetInnerHTML={{ __html: props.pageContext.html! }} />
        </div>
      </div>
    </Layout>
  )
}

export const query = graphql`
  query PlayExample {
    ...AllSitePage
  }
`


export default (props: Props) => <Intl locale={props.pageContext.lang}><Play {...props} /></Intl>
