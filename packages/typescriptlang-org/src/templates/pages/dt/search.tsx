import React from "react"
import { useIntl } from "react-intl";

import { Layout } from "../../../components/layout"
import { Intl } from "../../../components/Intl"
import { createInternational } from "../../../lib/createInternational"
import { dtCopy } from "../../../copy/en/dt"

type SearchProps = {
  pageContext: { lang: string }
}

const Search: React.FC<SearchProps> = ({ pageContext }) => {
  const intl = useIntl()
  const i = createInternational<typeof dtCopy>(intl)

  const title = i("dt_s_page_title");

  return (
    <Layout title={title} description={i("dt_s_subtitle")} lang={pageContext.lang}>
      <div className="raised main-content-block">
        <h1>{title}</h1>
        <p>
          {i("dt_s_read_more")}{' '}
          <a href="https://github.blog/changelog/2020-12-16-npm-displays-packages-with-bundled-typescript-declarations">
            {i("dt_s_read_more_link")}
          </a>.
        </p>
      </div>
    </Layout>
  )
}

export default (props: SearchProps) => (
  <Intl locale={props.pageContext.lang}>
    <Search {...props} />
  </Intl>
)
