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

const PlaygroundHandbook = (props: Props) => {
    return (
        <div dangerouslySetInnerHTML={{ __html: props.pageContext.html! }} />
  )
}



export default (props: Props) => <Intl locale={props.pageContext.lang}><PlaygroundHandbook {...props} /></Intl>
