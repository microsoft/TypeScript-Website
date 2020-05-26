import * as React from "react"
import { IntlProvider } from 'react-intl';

type IntlProps = {
  locale: string
}

export const Intl: React.FC<IntlProps> = (props) => {
  const { children, locale } = props
  let messages = require("../copy/en").lang
  try {
    messages = require("../copy/" + locale).lang
  } catch (error) {
    // NOOP
  }
  return (
    <IntlProvider locale={locale || "en"} messages={messages} >
      {children}
    </IntlProvider>
  )
}
