import React from "react"

import { Layout } from "../components/layout"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { Intl } from "../components/Intl"
import { headCopy } from "../copy/en/head-seo"

import "./markdown.scss"
import "./glossary.scss"

type Props = { pageContext: { locale: string; html: string; languageMeta: { terms: { id: string; display: string }[] } } }

const GlossaryTemplateComponent = (props: Props) => {
  const i = createInternational<typeof headCopy>(useIntl())

  const meta = props.pageContext.languageMeta
  return (
    <Layout title={i("tsconfig_title")} description={i("tsconfig_description")} lang={props.pageContext.locale}>
      <div id="glossary">
        <div className="whitespace raised content main-content-block subheadline" style={{ padding: "1rem", textAlign: "center" }}>This page is a work in progress, congrats on finding it!</div>

        <ul className="filterable-quicklinks main-content-block">
          {
            meta.terms.map(t => <li key={t.id}><a href={"#" + t.id}>{t.display}</a></li>)
          }
        </ul>
        <div dangerouslySetInnerHTML={{ __html: props.pageContext.html }} />
      </div>
    </Layout>
  )
}

export default (props: Props) => <Intl locale={props.pageContext.locale}><GlossaryTemplateComponent {...props} /></Intl>
