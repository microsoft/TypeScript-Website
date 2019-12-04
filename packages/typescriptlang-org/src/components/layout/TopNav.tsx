import React, { useEffect } from "react"
import { Helmet } from "react-helmet";
import { withPrefix } from "gatsby"

import "./TopNav.scss"
import { setupStickyNavigation } from "./stickyNavigation";

export type Props = {
  centeredLayout?: boolean
}

export const SiteNav = (props: Props) => {
  // This extra bit of mis-direction ensures that non-essential code runs after 
  // the page is loaded

  useEffect(() => {
    const searchScript = document.createElement('script');
    const searchCSS = document.createElement('link');

    searchScript.src = withPrefix("/js/docsearch.js");
    searchScript.async = true;
    searchScript.onload = () => {
      // @ts-ignore - this comes from the script above
      docsearch({
        apiKey: '3c2db2aef0c7ff26e8911267474a9b2c',
        indexName: 'typescriptlang',
        inputSelector: '.search input',
        // debug: true // Set debug to true if you want to inspect the dropdown
      });

      searchCSS.rel = 'stylesheet';
      searchCSS.href = withPrefix('/css/docsearch.css');
      searchCSS.type = 'text/css';
      document.body.appendChild(searchCSS);
    }

    document.body.appendChild(searchScript);

    setupStickyNavigation()

    return () => {
      document.body.removeChild(searchScript);
      document.body.appendChild(searchCSS);
    }
  }, []);


  return (
    <header dir="ltr">
      <Helmet htmlAttributes={{ lang: "en" }} meta={[
        {
          name: `description`,
          content: "metaDescription",
        },
        {
          property: `og:title`,
          content: "title",
        },
        {
          property: `og:description`,
          content: "metaDescription",
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary`,
        },
        {
          name: `twitter:creator`,
          content: "@typescript",
        },
        {
          name: `twitter:title`,
          content: "title",
        },
        {
          name: `twitter:description`,
          content: "metaDescription",
        },
      ]}>
        <title>TypeScript</title>
        <link rel="stylesheet" href="https://static2.sharepointonline.com/files/fabric/office-ui-fabric-core/10.0.0/css/fabric.min.css" />
      </Helmet>

      <a className="skip-to-main" href="#site-content" tabIndex={0}>Skip to main content</a>

      <div id="top-menu" className="up">
        <div className="left below-small">

          <a id="home-page-logo" href="/" aria-label="TypeScript Home Page">
            <svg fill="none" height="26" viewBox="0 0 27 26" width="27" xmlns="http://www.w3.org/2000/svg"><path clipRule="evenodd" d="m.98608 0h24.32332c.5446 0 .9861.436522.9861.975v24.05c0 .5385-.4415.975-.9861.975h-24.32332c-.544597 0-.98608-.4365-.98608-.975v-24.05c0-.538478.441483-.975.98608-.975zm13.63142 13.8324v-2.1324h-9.35841v2.1324h3.34111v9.4946h2.6598v-9.4946zm1.0604 9.2439c.4289.2162.9362.3784 1.5218.4865.5857.1081 1.2029.1622 1.8518.1622.6324 0 1.2331-.0595 1.8023-.1784.5691-.1189 1.0681-.3149 1.497-.5879s.7685-.6297 1.0187-1.0703.3753-.9852.3753-1.6339c0-.4703-.0715-.8824-.2145-1.2365-.1429-.3541-.3491-.669-.6186-.9447-.2694-.2757-.5925-.523-.9692-.7419s-.8014-.4257-1.2743-.6203c-.3465-.1406-.6572-.2771-.9321-.4095-.275-.1324-.5087-.2676-.7011-.4054-.1925-.1379-.3409-.2838-.4454-.4379-.1045-.154-.1567-.3284-.1567-.523 0-.1784.0467-.3392.1402-.4824.0935-.1433.2254-.2663.3959-.369s.3794-.1824.6269-.2392c.2474-.0567.5224-.0851.8248-.0851.22 0 .4523.0162.697.0486.2447.0325.4908.0825.7382.15.2475.0676.4881.1527.7218.2555.2337.1027.4495.2216.6475.3567v-2.4244c-.4015-.1514-.84-.2636-1.3157-.3365-.4756-.073-1.0214-.1095-1.6373-.1095-.6268 0-1.2207.0662-1.7816.1987-.5609.1324-1.0544.3392-1.4806.6203s-.763.6392-1.0104 1.0743c-.2475.4352-.3712.9555-.3712 1.5609 0 .7731.2268 1.4326.6805 1.9785.4537.546 1.1424 1.0082 2.0662 1.3866.363.146.7011.2892 1.0146.4298.3134.1405.5842.2865.8124.4378.2282.1514.4083.3162.5403.4946s.198.3811.198.6082c0 .1676-.0413.323-.1238.4662-.0825.1433-.2076.2676-.3753.373s-.3766.1879-.6268.2473c-.2502.0595-.5431.0892-.8785.0892-.5719 0-1.1383-.0986-1.6992-.2959-.5608-.1973-1.0805-.4933-1.5589-.8879z" fill="#fff" fillRule="evenodd" /></svg>
            <span className="hide-small">TypeScript</span>
          </a>

          <nav>
            <ul>
              <li className="nav-item"><a href="/docs">Documentation</a></li>
              <li className="nav-item hide-small"><a href="/index.html#download-links">Download</a></li>
              <li className="nav-item"><a href="/community">Connect</a></li>
              <li className="nav-item"><a href="/play">Playground</a></li>
            </ul>
          </nav>
        </div>

        <div className="right above-small">
          <nav >
            <ul>
              <li className="nav-item">
                <form className="search top-nav" role="search">
                  <svg fill="none" height="16" viewBox="0 0 16 16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="m10.5 0c.5052 0 .9922.0651042 1.4609.195312.4688.130209.9063.315105 1.3125.554688.4063.239583.7761.52865 1.1094.86719.3386.33333.6276.70312.8672 1.10937s.4245.84375.5547 1.3125.1953.95573.1953 1.46094-.0651.99219-.1953 1.46094-.3151.90625-.5547 1.3125-.5286.77864-.8672 1.11718c-.3333.33334-.7031.61978-1.1094.85938-.4062.2396-.8437.4245-1.3125.5547-.4687.1302-.9557.1953-1.4609.1953-.65104 0-1.27604-.1094-1.875-.3281-.59375-.2188-1.14062-.5339-1.64062-.94534l-6.132818 6.12504c-.098958.0989-.216145.1484-.351562.1484s-.252604-.0495-.351562-.1484c-.0989588-.099-.148438-.2162-.148438-.3516s.0494792-.2526.148438-.3516l6.125002-6.13278c-.41146-.5-.72656-1.04687-.94532-1.64062-.21874-.59896-.32812-1.22396-.32812-1.875 0-.50521.0651-.99219.19531-1.46094s.31511-.90625.55469-1.3125.52604-.77604.85938-1.10937c.33854-.33854.71093-.627607 1.11718-.86719s.84375-.424479 1.3125-.554688c.46875-.1302078.95573-.195312 1.46094-.195312zm0 10c.6198 0 1.2031-.11719 1.75-.35156.5469-.23959 1.0234-.5625 1.4297-.96875.4062-.40625.7265-.88281.9609-1.42969.2396-.54688.3594-1.13021.3594-1.75s-.1198-1.20312-.3594-1.75c-.2344-.54688-.5547-1.02344-.9609-1.42969-.4063-.40625-.8828-.72656-1.4297-.96093-.5469-.23959-1.1302-.35938-1.75-.35938-.61979 0-1.20312.11979-1.75.35938-.54688.23437-1.02344.55468-1.42969.96093s-.72916.88281-.96875 1.42969c-.23437.54688-.35156 1.13021-.35156 1.75s.11719 1.20312.35156 1.75c.23959.54688.5625 1.02344.96875 1.42969s.88281.72916 1.42969.96875c.54688.23437 1.13021.35156 1.75.35156z" fill="#fff" /></svg>
                  <span><input id='search-box-top' type="search" placeholder="Search Docs" /></span>
                  <input type="submit" style={{ display: "none" }} />
                </form>
              </li>
              <li className="nav-item hide-small"><a href="#" title="Popover for app settings"><svg fill="none" height="12" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg"><circle cx="6" cy="6" fill="#fff" r="6" /></svg></a></li>
              <li className="nav-item hide-small"><a href="/play">en</a></li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="hide-small" id="beta-notification-menu">Note: this page is a beta page, the URL is not guaranteed to stick around.</div>
      <div id="site-content" />
    </header >

  )
}
