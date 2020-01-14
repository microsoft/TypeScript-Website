import React from "react"
import { SiteNav, Props } from "./layout/TopNav"
import { SiteFooter } from "./layout/SiteFooter"
import { IntlProvider, } from 'react-intl';

type LayoutProps = Props & {
  locale?: string
  children: any
}

export const Layout = (props: LayoutProps) => {
  const { children, locale } = props
  let messages = require("../copy/en").lang
  try {
    messages = require("../copy/" + locale).lang
  } catch (error) {
    // NOOP
  }
  console.log(messages)
  return (
    <IntlProvider locale={locale || "en"} messages={messages} >
      <div className="ms-Fabric">
        <SiteNav {...props} />
        <main>{children}</main>
        <SiteFooter />
      </div>
    </IntlProvider>
  )
}
