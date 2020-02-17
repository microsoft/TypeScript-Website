import React from "react"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"
import { graphql } from "gatsby"

const conferences =
  [
    {
      "title": "TSConf",
      "location": "Seattle, WA",
      "url": "https://tsconf.io",
      "date": "October 11th, 2019",
      "country": "🇺🇸",
      "image": "/assets/images/community/conferences/tsconf-2019-logo.png"
    },
    {
      "title": "TSConf IT",
      "location": "Desenzano del Garda",
      "url": "https://ts-conf.it/",
      "date": "October 25th, 2019",
      "country": "🇮🇹",
      "image": "/assets/images/community/conferences/tsconf-it-2019-logo.png"
    },
    {
      "title": "TSConf JP",
      "location": "Tokyo",
      "url": "https://tsconf.jp",
      "date": "February 22nd, 2020",
      "country": "🇯🇵",
      "image": "/assets/images/community/conferences/tsconf-jp-logo.png"
    },
    {
      "title": "TSConf:EU",
      "location": "Linz",
      "url": "https://tsconf.eu",
      "date": "March 31st, 2020",
      "country": "🇦🇹",
      "image": "/assets/images/community/conferences/tsconf-eu-2020-logo.png"
    }
  ]

const meetups =
{
  "waiting_coc": [
    {
      "title": "Dublin TypeScript Meetup",
      "twitter": "https://twitter.com/DubTypeScript",
      "url": "https://www.meetup.com/Dublin-TypeScript-Meetup/",
      "image": "/assets/images/community/meetup-logos/dublin-ts.jpg",
      "country": "🇮🇪"
    },
    {
      "title": "London TypeScript Meetup",
      "twitter": "https://twitter.com/LndTypeScript",
      "url": "https://www.meetup.com/London-Typescript-Meetup/",
      "image": "/assets/images/community/meetup-logos/london-ts.jpg",
      "country": "🇬🇧"
    },
    {
      "title": "Warsaw TypeScript",
      "twitter": "https://twitter.com/wwatypescript",
      "url": "https://www.meetup.com/Warsaw-Typescript/",
      "image": "/assets/images/community/meetup-logos/warsaw-ts.jpg",
      "country": "🇵🇱"
    }
  ],
  "ready": [
    {
      "title": "Hamburg TypeScript",
      "url": "https://www.meetup.com/Hamburg-TypeScript-Meetup-Group/",
      "image": "/assets/images/community/meetup-logos/hamburg-ts.png",
      "country": "🇩🇪"
    },
    {
      "title": "Krakow TypeScript User Group",
      "url": "https://www.meetup.com/typescript-krakow/",
      "image": "/assets/images/community/meetup-logos/ktug.jpg",
      "country": "🇵🇱"
    },
    {
      "title": "Melbourne TypeScript",
      "url": "https://www.meetup.com/Melbourne-TypeScript-Meetup/",
      "image": "/assets/images/community/meetup-logos/melbourne.jpg",
      "country": "🇦🇺"
    },
    {
      "title": "Milano TS",
      "twitter": "https://twitter.com/Milano_TS",
      "url": "https://www.meetup.com/MilanoTS/",
      "image": "/assets/images/community/meetup-logos/milano-ts.jpg",
      "country": "🇮🇹"
    },
    {
      "title": "Seattle TypeScript",
      "url": "https://www.meetup.com/seattle-ts",
      "image": "/assets/images/community/meetup-logos/seattle.jpg",
      "country": "🇺🇸"
    },
    {
      "title": "Sevilla TypeScript",
      "twitter": "https://twitter.com/SVQTypeScript",
      "url": "https://www.meetup.com/Sevilla-TypeScript/",
      "image": "/assets/images/community/meetup-logos/sqvts.jpg",
      "country": "🇪🇸"
    },

    {
      "title": "San Francisco TypeScript Meetup",
      "url": "https://www.meetup.com/San-Francisco-TypeScript-Meetup/",
      "image": "/assets/images/community/meetup-logos/san-fran-ts.jpg",
      "country": "🇺🇸"
    },
    {
      "title": "Sydney TypeScript",
      "twitter": "https://twitter.com/SydTypeScript",
      "url": "https://www.meetup.com/Sydney-TypeScript//",
      "image": "/assets/images/community/meetup-logos/sydney.jpg",
      "country": "🇦🇺"
    },
    {
      "title": "TypeScript NYC",
      "url": "https://www.meetup.com/TypeScriptNYC/",
      "image": "/assets/images/community/meetup-logos/typescript-nyc.jpg",
      "country": "🇺🇸"
    },
    {
      "title": "Typescript Brazil Meetup",
      "twitter": "https://twitter.com/tsbrmeetup",
      "url": "https://www.meetup.com/typescriptbr/",
      "image": "/assets/images/community/meetup-logos/brazil-ts.jpg",
      "country": "🇧🇷"
    },
    {
      "title": "TypeScript JP",
      "twitter": "https://twitter.com/typescriptjp",
      "url": "https://typescript-jp.dev",
      "image": "/assets/images/community/meetup-logos/typescript-jp.jpg",
      "country": "🇯🇵"
    },
    {
      "title": "Paris TypeScript",
      "twitter": "https://twitter.com/ParisTypeScript",
      "url": "https://www.meetup.com/Paris-Typescript/",
      "image": "/assets/images/community/meetup-logos/paris-ts.jpg",
      "country": "🇫🇷"
    },
    {
      "title": "Phoenix TypeScript",
      "url": "https://www.meetup.com/Phoenix-TypeScript/",
      "image": "https://halfstackconf.com/assets/images/phxts.svg",
      "country": "🇺🇸"
    },
    {
      "title": "Wroclaw TypeScript",
      "twitter": "https://twitter.com/WrocTypeScript",
      "url": "https://typescript.community/",
      "image": "/assets/images/community/meetup-logos/wroclaw-ts.jpg",
      "country": "🇵🇱"
    }
  ]
}



export const Comm = (props: any) => (
  <Layout title="How to set up TypeScript" description="" lang="en" allSitePage={props.data.allSitePage}>

    <div className="container community main_content">
      <h1>Connect with us</h1>
      <h2>Connect online</h2>
      <p className="banner-text">Tell us what’s working well, what you want to see added or improved, and find out about new updates.</p>
      <div className="callouts">
        <div className="row">
          <div className="callout col-md-4">
            <a aria-labelledby="stack-header" className="icon stackoverflow img-circle" href="{{ site.data.urls.ts_stackoverflow_tagged }}" target="_blank"></a>
            <a href="{{ site.data.urls.ts_stackoverflow_tagged }}" id="stack-header" target="_blank"><h3 className="community-callout-headline">Stack Overflow</h3></a>
            <div className="text">Engage with your peers and ask questions about Typescript on <a href="{{ site.data.urls.ts_stackoverflow_tagged }}" target="_blank">Stack Overflow</a> using the tag <b>typescript.</b></div>
          </div>
          <div className="callout col-md-4">
            <a aria-labelledby="discord-header" className="icon discord img-circle" href="https://discord.gg/typescript"></a>
            <a href="https://discord.gg/typescript" id="discord-header"><h3 className="community-callout-headline">Chat</h3></a>
            <div className="text">Chat with other TypeScript users in the TypeScript Community Chat.</div>
          </div>
          <div className="callout col-md-4">
            <a aria-labelledby="github-header" className="icon bug img-circle" href="{{ site.data.urls.ts_github_issues }}" target="_blank"></a>
            <a href="{{ site.data.urls.ts_github_issues }}" id="github-header"> <h3 className="community-callout-headline">GitHub</h3></a>
            <div className="text">Found a bug, or want to give us feedback? <a href="{{ site.data.urls.ts_github_issues }}">Tell us on GitHub</a>.</div>
          </div>
        </div>
        <div className="row">
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
      </div>

      <h2>Connect in person</h2>

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

      <h3>Meetups</h3>
      <div className="callouts">
        <div className="row">
          {meetups.ready.map(meetup => (
            <div className="callout">
              <img src={meetup.image} className="icon img-square" alt={"logo of " + meetup.title} />
              <h4 className="community-callout-headline">{meetup.title}</h4>
              <div className="text">{meetup.country}<br /><a rel="noopener" target="blank" href={meetup.url}>Website</a>{meetup.twitter ? <a rel="noopener" target="blank" href={meetup.twitter}>Twitter</a> : null}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </Layout >
)

export default (props: any) => <Intl><Comm {...props} /></Intl>


export const query = graphql`
  query {
      ...AllSitePage
    }
    `
