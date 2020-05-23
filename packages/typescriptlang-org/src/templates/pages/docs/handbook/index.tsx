import * as React from "react"
import { Layout } from "../../../../components/layout"
import { Link } from "gatsby"

import "../../css/documentation.scss"
import "../../../handbook.scss"

import { Intl } from "../../../../components/Intl"

import { docCopy } from "../../../../copy/en/documentation"
import { createInternational } from "../../../../lib/createInternational"
import { useIntl } from "react-intl"
import { graphql } from "gatsby"
import { DocsHomeQuery } from "../../../../__generated__/gatsby-types"
import { handbookNavigation } from "../../../../lib/handbookNavigation"

type Props = {
  data: DocsHomeQuery
  pageContext: any
}

const HandbookIndex: React.FC<Props> = (props) => {
  const i = createInternational<typeof docCopy>(useIntl())
  return (
    <Layout title={i("doc_layout_title")} description={i("doc_layout_description")} lang={props.pageContext.lang} allSitePage={props.data.allSitePage}>

      <div className="main-content-block headline" style={{ marginTop: "40px" }}>
        <h1>TypeScript Handbook</h1>
        <p>The handbook will help you learn to be productive in TypeScript.</p>
        <p>We also have an <a href='/assets/typescript-handbook-beta.epub'>epub version of the Handbook</a>.</p>
      </div>

      <div className="main-content-block container handbook-content" >
        <div className="columns wide">
          {handbookNavigation.map(navRoot => {
            if (navRoot.id === "whats-new") return null

            return (
              <div className="item raised" key={navRoot.id}>

                <h4>{navRoot.title}</h4>
                <p>{navRoot.summary}</p>

                <ul>
                  {navRoot.items.map(item => {
                    const filename = item.id === "index" ? "" : `${item.id}.html`
                    const path = item.href || `/docs/${navRoot.directory}/${filename}`

                    return <li key={item.id}>
                      <Link to={path}>{item.title}</Link>
                    </li>
                  })}

                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </Layout >
  )
}

export const query = graphql`
  query HandbookHome {
          ...AllSitePage
        }
`

export default (props: Props) => (
  <Intl locale={props.pageContext.lang}>
    <HandbookIndex {...props} />
  </Intl>
)
