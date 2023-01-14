import React, { useEffect, useState } from "react"
import { Layout } from "../../../components/layout"
import { Intl } from "../../../components/Intl"

import { createInternational } from "../../../lib/createInternational"
import { useIntl } from "react-intl"
import { dtCopy } from "../../../copy/en/dt"

type SearchProps = {
  pageContext: any
}

const Search: React.FC<SearchProps> = ({ pageContext }) => {
  const i = createInternational<typeof dtCopy>(useIntl())

  return (
    <Layout title={i("dt_s_page_title")} description={i("dt_s_subtitle")} lang={pageContext.lang}>
      <p>
        {i("dt_s_read_more")}
        <a href="https://github.blog/changelog/2020-12-16-npm-displays-packages-with-bundled-typescript-declarations">
          {i("dt_s_read_more_link")}
        </a>.
      </p>
    </Layout>
  )
}

export default (props: SearchProps) => (
  <Intl locale={props.pageContext.lang}>
    <Search {...props} />
  </Intl>
)
