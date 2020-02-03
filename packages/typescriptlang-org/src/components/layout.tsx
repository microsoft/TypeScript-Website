import React from "react"
import { SiteNav, Props } from "./layout/TopNav"
import { SiteFooter } from "./layout/SiteFooter"
import { IntlProvider, } from 'react-intl';
import { SeoProps, HeadSEO } from "./HeadSEO";
import "./layout/main.scss"
import { Intl } from "./Intl";

type LayoutProps = SeoProps & Props & {
  locale?: string
  children: any
}

export const Layout = (props: LayoutProps) => {

  return (
    <Intl locale={props.locale} >
      <HeadSEO {...props} />
      <div className="ms-Fabric">
        <SiteNav {...props} />
        <main>{props.children}</main>
        <SiteFooter />
      </div>
    </Intl>
  )
}
