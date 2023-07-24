import * as React from "react"
import { Layout } from "../../../../components/layout"
import { Link } from "gatsby"

import "../../css/documentation.scss"
import "../../../documentation.scss"

import { Intl } from "../../../../components/Intl"

import { docCopy } from "../../../../copy/en/documentation"
import { createInternational } from "../../../../lib/createInternational"
import { useIntl } from "react-intl"
import { getDocumentationNavForLanguage } from "../../../../lib/documentationNavigation"

type Props = {
  pageContext: any
}

const HandbookIndex: React.FC<Props> = (props) => {
  const i = createInternational<typeof docCopy>(useIntl())
  const nav = getDocumentationNavForLanguage(props.pageContext.lang)

  return (
    <Layout title={i("doc_layout_title")} description={i("doc_layout_description")} lang={props.pageContext.lang}>

      <div className="main-content-block headline" style={{ marginTop: "40px" }}>
        <h1>TypeScript Documentation</h1>
      </div>

      <div className="main-content-block container handbook-content" >
        <div className="columns wide">
          {nav.map(navRoot => {
            if (navRoot.id === "what's-new") return null
            const showIntro = navRoot.id === "handbook"

            return (
              <div className="item raised" key={navRoot.id}>

                <h4>{navRoot.title}</h4>
                <p>{navRoot.oneline || " "}</p>

                <ul>
                  {navRoot.items && navRoot.items.map(item => {
                    const path = item.permalink!
                    if (item.items) return null

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

export default (props: Props) => (
  <Intl locale={props.pageContext.lang}>
    <HandbookIndex {...props} />
  </Intl>
)
