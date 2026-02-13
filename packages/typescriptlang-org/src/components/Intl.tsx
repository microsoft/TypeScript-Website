import * as React from "react"
import { IntlProvider } from 'react-intl';
import { lang as enMessages } from "../copy/en/en";

// Static message map - add languages here as needed
const messagesByLocale: Record<string, Record<string, string>> = {
  en: enMessages,
};

type IntlProps = {
  locale: string
  children: any
}

export const Intl = (props: IntlProps) => {
  const { children, locale } = props
  const messages = messagesByLocale[locale] || messagesByLocale.en
  return (
    <IntlProvider locale={locale || "en"} messages={messages} >
      {children}
    </IntlProvider>
  )
}
