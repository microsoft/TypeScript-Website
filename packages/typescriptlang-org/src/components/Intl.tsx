import * as React from "react"
import { IntlProvider } from 'react-intl';

type IntlProps = {
  locale: string
  children: any
}

export const Intl = (props: IntlProps) => {
  const { children, locale } = props
  let messages = require("../copy/en/en").lang
  try {
    messages = require("../copy/" + locale + "/" + locale).lang
  } catch (error) {
    // NOOP
  }
  return (
    <IntlProvider locale={locale || "en"} messages={messages} >
      {children}
    </IntlProvider>
  )
}
