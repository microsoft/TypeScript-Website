import React, { useEffect } from "react"
import { Layout } from "../components/layout"

import "./play.scss"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { headCopy } from "../copy/en/head-seo"
import { Intl } from "../components/Intl"
import { withPrefix } from "gatsby";

type Props = {
  pageContext: {
    lang: string
    html: string
    name: string
    title: string
    redirectHref: string
  }
}

const Play = (props: Props) => {
  const i = createInternational<typeof headCopy>(useIntl())
  useEffect(() => {
    // Keep this page around so it is indexed on search engines
    const isBot = /bot|google|baidu|bing|msn|duckduckbot|teoma|slurp|yandex/i.test(navigator.userAgent)
    if (!isBot) {
      document.location = withPrefix(props.pageContext.redirectHref)
    }
  })

  return (
    <Layout disableBetaNotification title={i("playground_example_prefix") + props.pageContext.title} description={i("head_playground_description")}>
      <div className="raised" style={{ paddingTop: "0", marginTop: "20px", marginBottom: "3rem", paddingBottom: "1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px" }}>
          <p dangerouslySetInnerHTML={{ __html: props.pageContext.html! }} />
        </div>
      </div>
    </Layout>
  )
}


export default (props: Props) => <Intl locale={props.pageContext.lang}><Play {...props} /></Intl>
