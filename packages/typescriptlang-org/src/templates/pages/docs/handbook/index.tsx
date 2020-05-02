import * as React from "react"
import { Layout } from "../../../../components/layout"

import "../../css/documentation.scss"
import "../../../handbook.scss"

import { ButtonGrid } from "../../../../components/display/ButtonGrid"
import { Intl } from "../../../../components/Intl"

import { docCopy } from "../../../../copy/en/documentation"
import { createInternational } from "../../../../lib/createInternational"
import { useIntl } from "react-intl"
import { graphql } from "gatsby"
import { DocsHomeQuery } from "../../../../__generated__/gatsby-types"
import { QuickJump } from "../../../../components/QuickJump"
import { Sidebar, SidebarToggleButton } from "../../../../components/layout/Sidebar"
import { oldHandbookNavigation } from "../../../../lib/oldHandbookNavigation"

type Props = {
  data: DocsHomeQuery
  pageContext: any
}

const HandbookIndex: React.FC<Props> = (props) => {
  const i = createInternational<typeof docCopy>(useIntl())
  return (
    <Layout
      title={i("doc_layout_title")}
      description={i("doc_layout_description")}
      lang={props.pageContext.lang}
      allSitePage={props.data.allSitePage}
    >
      <section id="doc-layout">
        <SidebarToggleButton />
        <noscript>
          <style dangerouslySetInnerHTML={{
            __html: `
          nav#sidebar > ul > li.closed ul {
            display: block !important;
           }
        ` }} />
        </noscript>

        <Sidebar navItems={oldHandbookNavigation} selectedID={""} openAllSectionsExceptWhatsNew />
        <div id="handbook-content">
          <h1>{i("doc_headline")}</h1>

          <ButtonGrid
            buttons={[
              {
                title: i("doc_headline_ts_for_js_title"),
                href: "/docs/handbook/typescript-in-5-minutes.html",
                blurb: i("doc_headline_ts_for_js_blurb"),
              },
              {
                title: i("doc_headline_ts_first_title"),
                href: "/docs/handbook/typescript-from-scratch.html",
                blurb: i("doc_headline_ts_first_blurb"),
              },
              {
                title: i("doc_headline_handbook_title"),
                href: "/docs/handbook/basic-types.html",
                blurb: i("doc_headline_handbook_blurb"),
              },
              {
                title: i("doc_headline_examples_title"),
                href: "/play?#show-examples",
                blurb: i("doc_headline_examples_blurb"),
              },
            ]}
            headline={true}
          />

          <QuickJump allSitePage={props.data.allSitePage} lang={props.pageContext.lang} />
        </div>
      </section>
    </Layout>
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
