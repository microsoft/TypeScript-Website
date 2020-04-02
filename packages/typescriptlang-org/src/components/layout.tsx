import React from "react"
import { SiteNav, Props } from "./layout/TopNav"
import { SiteFooter } from "./layout/SiteFooter"
import { SeoProps, HeadSEO } from "./HeadSEO";
import "./layout/main.scss"
import { AppInsights } from "./AppInsights";
import { Helmet } from "react-helmet";
import { CookieBanner } from "./layout/CookieBanner"

type LayoutProps = SeoProps & Props & {
  lang: string,
  children: any
}

// Test for IE11
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function forEach(callback, thisArg) {
    if (typeof callback !== 'function') {
      throw new TypeError(callback + ' is not a function');
    }
    var array = this;
    thisArg = thisArg || this;
    for (var i = 0, l = array.length; i !== l; ++i) {
      callback.call(thisArg, array[i], i, array);
    }
  };
}

const hasWindow = (typeof window !== `undefined`)

if (hasWindow && window.NodeList && !NodeList.prototype.forEach) {
  // @ts-ignore
  NodeList.prototype.forEach = Array.prototype.forEach;
}

// @ts-ignore
if (hasWindow && window.HTMLCollection && !HTMLCollection.prototype.forEach) {
  // @ts-ignore
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

export const Layout = (props: LayoutProps) => {
  return (
    <>
      <Helmet htmlAttributes={{ lang: props.lang }}>
        {/* Should be a NOOP for anything but edge, and much older browsers */}
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es2015" />
      </Helmet>
      <HeadSEO {...props} />
      <div className="ms-Fabric">
        <SiteNav {...props} />
        <CookieBanner />
        <main>{props.children}</main>
        <SiteFooter {...props} />
      </div>
      <AppInsights />
    </>
  )
}
