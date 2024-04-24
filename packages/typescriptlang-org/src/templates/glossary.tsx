import React from "react"
import { graphql } from "gatsby"

import { Layout } from "../components/layout"

import { useIntl } from "react-intl";
import { createInternational } from "../lib/createInternational"
import { Intl } from "../components/Intl"
import { headCopy } from "../copy/en/head-seo"

import "./markdown.scss"
import "./glossary.scss"

type Props = { pageContext: any, data: GatsbyTypes.TSConfigReferenceTemplateQuery, path: string }

const GlossaryTemplateComponent = (props) => {
  const i = createInternational<typeof headCopy>(useIntl())

  const post = props.data.markdownRemark
  if (!post) {
    console.log("Could not render:", JSON.stringify(props))
    return <div></div>
  }

  const meta = props.pageContext.languageMeta as typeof import("../../../glossary/output/en.json")
  return (
    <Layout title={i("tsconfig_title")} description={i("tsconfig_description")} lang={props.pageContext.locale}>
      <div id="glossary">
        <div className="whitespace raised content main-content-block subheadline" style={{ padding: "1rem", textAlign: "center" }}>This page is a work in progress, congrats on finding it!</div>

        <ul className="filterable-quicklinks main-content-block">
          {
            meta.terms.map(t => <li key={t.id}><a href={"#" + t.id}>{t.display}</a></li>)
          }
        </ul>
        <div dangerouslySetInnerHTML={{ __html: post.html! }} />
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query GlossaryTemplate($glossaryPath: String!) {
    markdownRemark(fileAbsolutePath: {eq: $glossaryPath} ) {
      id
      html
      frontmatter {
        permalink
      }
    }
  }
`

export default (props: Props) => <Intl locale={props.pageContext.locale}><GlossaryTemplateComponent {...props} /></Intl>
