import React from "react"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"
import { graphql } from "gatsby"
import { CommunityPageQuery } from "../../__generated__/gatsby-types"
import { indexCopy } from "../../copy/en/index"
import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"


import meetups from "../../../../community-meta/generated/meetups.json"

import "./css/community.scss"

const conferences =
  [
    {
      "title": "TSConf",
      "location": "Seattle, WA",
      "url": "https://tsconf.io",
      "date": "October 11th, 2019",
      "image": require("../../assets/community/conferences/tsconf-2019-logo.png")
    },
    {
      "title": "TSConf IT",
      "location": "Desenzano del Garda",
      "url": "https://ts-conf.it/",
      "date": "October 25th, 2019",
      "country": "🇮🇹",
      "image": require("../../assets/community/conferences/tsconf-it-2019-logo.png")
    },
    {
      "title": "TSConf JP",
      "location": "Tokyo",
      "url": "https://tsconf.jp",
      "date": "February 22nd, 2020",
      "country": "🇯🇵",
      "image": require("../../assets/community/conferences/tsconf-jp-logo.png")
    },
    {
      "title": "TSConf:EU",
      "location": "Linz",
      "url": "https://tsconf.eu",
      "date": "March 31st, 2020",
      "country": "🇦🇹",
      "image": require("../../assets/community/conferences/tsconf-eu-2020-logo.png")
    }
  ]

type Props = {
  data: CommunityPageQuery
  pageContext: any
}

export const Comm: React.FC<Props> = (props) => {
  const intl = useIntl()
  const i = createInternational<typeof indexCopy>(intl)

  return (
    <Layout title="How to set up TypeScript" description="" lang={props.pageContext.lang} allSitePage={props.data.allSitePage}>
      <div className="raised main-content-block container community">
        <h1>Connect with us</h1>
        <h2>Connect online</h2>
        <p className="banner-text">Tell us what’s working well, what you want to see added or improved, and find out about new updates.</p>

        <div className="row callouts">
          <div className="callout" style={{ flex: 1 }}>
            <a aria-labelledby="stack-header" className="icon stackoverflow img-circle" href="{{ site.data.urls.ts_stackoverflow_tagged }}" target="_blank"></a>
            <a href="{{ site.data.urls.ts_stackoverflow_tagged }}" id="stack-header" target="_blank"><h3 className="community-callout-headline">Stack Overflow</h3></a>
            <div className="text">Engage with your peers and ask questions about Typescript on <a href="{{ site.data.urls.ts_stackoverflow_tagged }}" target="_blank">Stack Overflow</a> using the tag <b>typescript.</b></div>
          </div>
          <div className="callout col-md-4" style={{ flex: 1 }}>
            <a aria-labelledby="discord-header" className="icon discord img-circle" href="https://discord.gg/typescript"></a>
            <a href="https://discord.gg/typescript" id="discord-header"><h3 className="community-callout-headline">Chat</h3></a>
            <div className="text">Chat with other TypeScript users in the TypeScript Community Chat.</div>
          </div>
          <div className="callout col-md-4" style={{ flex: 1 }}>
            <a aria-labelledby="github-header" className="icon bug img-circle" href="{{ site.data.urls.ts_github_issues }}" target="_blank"></a>
            <a href="{{ site.data.urls.ts_github_issues }}" id="github-header"> <h3 className="community-callout-headline">GitHub</h3></a>
            <div className="text">Found a bug, or want to give us feedback? <a href="{{ site.data.urls.ts_github_issues }}">Tell us on GitHub</a>.</div>
          </div>
        </div>
        <div className="row callouts">
          <div className="callout col-md-4">
            <a aria-labelledby="twitter-header" className="icon twitter img-circle" href="{{ site.data.urls.ts_twitter }}" target="_blank"></a>
            <a href="{{ site.data.urls.ts_twitter }}" id="twitter-header" target="_blank"><h3 className="community-callout-headline">Twitter</h3></a>
            <div className="text">Stay up to date.  Follow us on Twitter <a href="{{ site.data.urls.ts_twitter }}" target="_blank">@typescript</a>!</div>
          </div>
          <div className="callout col-md-4">
            <a aria-labelledby="blog-header" className="icon blog img-circle" href="{{ site.data.urls.ts_blog }}" target="_blank"></a>
            <a href="{{ site.data.urls.ts_blog }}" id="blog-header" target="_blank"><h3 className="community-callout-headline">Blog</h3></a>
            <div className="text">Learn about the latest TypeScript developments via our <a href="{{ site.data.urls.ts_blog }}" target="_blank">blog</a>!</div>
          </div>
          <div className="callout col-md-4">
            <a aria-labelledby="deftyped-header" className="icon definitelytyped img-circle" href="{{ site.data.urls.definitelytyped_github }}" target="_blank"></a>
            <a href="{{ site.data.urls.definitelytyped_github }}" id="deftyped-header" target="_blank"><h3 className="community-callout-headline">Definitely Typed</h3></a>
            <div className="text">Browse the thousands of <a href="{{ site.data.urls.definitelytyped_github }}" target="_blank">TypeScript definition files</a> available for common libraries and frameworks.</div>
          </div>
        </div>


        <h2>Connect in person</h2>

        <div style={{ display: "none" }}>
          <h3>Conferences</h3>
          <div className="callouts">
            <div className="row">
              {conferences.map(conference => (
                <div className="callout col-md-4">
                  <a href={conference.url} rel="noopener" target="blank"><img src={conference.image} className="icon img-square" alt={"logo of " + conference.title} /></a>
                  <a href={conference.url}><h4 className="community-callout-headline">{conference.title}</h4></a>
                  <div className="text">
                    {conference.location} {conference.country}<br /><time>{conference.date}</time>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <h3>Upcoming Meetups</h3>
        <div className="callouts">
          <div className="row">
            {meetups.filter(m => m.event).sort((l, r) => new Date(l.event!.date).getTime() - new Date(r.event!.date).getTime()).map(m => (
              <div className="col1 upcoming-event" >
                <h4>{m.meetup.title}</h4>
                <h4>{intl.formatDate(m.event!.date)}</h4>
                <div className="meetup-text"><div dangerouslySetInnerHTML={{ __html: m.event!.richDescription }} /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout >
  )
}
// {meetups.map(m => (
//   <div className="callout">
//     <img src={m.meetup.image} className="icon img-square" alt={"logo of " + m.meetup.title} />
//     <h4 className="community-callout-headline">{m.meetup.title}</h4>
//     <div className="text">{m.meetup.country}<br /><a rel="noopener" target="blank" href={m.meetup.url}>Website</a>{m.meetup.twitter ? <a rel="noopener" target="blank" href={meetup.twitter}>Twitter</a> : null}</div>
//   </div>
// ))}
export default (props: Props) => <Intl><Comm {...props} /></Intl>


export const query = graphql`
    query CommunityPage {
      ...AllSitePage
    }
`
