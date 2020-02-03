import React from "react"
import { Layout } from "../components/layout"

import "./css/documentation.scss"
import { ButtonGrid, GridProps } from "../components/display/ButtonGrid"

const headlineGrid: GridProps = {
  buttons: [
    {
      title: "TS in 5m",
      href: "/docs/handbook/typescript-in-5-minutes.html",
      blurb: "5 minute overview of the language",
    }, {
      title: "TS Tooling",
      href: "/docs/handbook/typescript-in-5-minutes.html",
      blurb: "5 minute overview of the tooling",
    }, {
      title: "Handbook",
      href: "/docs/handbook/basic-types.html",
      blurb: "The TypeScript language reference",
    }, {
      title: "Examples",
      href: "/play/index.html?#show-examples",
      blurb: "Comprehensive hands-on playground tutorials",
    }
  ],
  headline: true
}


const apis = [
  {
    href: "https://code.visualstudio.com/tutorials/functions-extension/getting-started",
    blurb: "Build and deploy from VS Code in minutes",
    title: "Azure Functions"
  },
  {

    href: "https://feathersjs.com",
    blurb: "A framework for real-time applications and REST APIs",
    title: "Feathers JS"
  },
  {

    href: "https://github.com/graphql-boilerplates/typescript-graphql-server",
    blurb: "Bootstrap your GraphQL server within seconds",
    title: "GraphQL"
  },
  {

    href: "https://nestjs.com",
    blurb: "A progressive Node.js framework for building efficient and scalable server-side applications",
    title: "Nest JS"
  },
  {

    href: "https://github.com/Microsoft/TypeScript-Node-Starter",
    blurb: "A documented starter template from the TS team",
    title: "Node Starter"
  },
  {

    href: "https://github.com/microsoft/TypeScript-WeChat-Starter/blob/master/README.md",
    badge: "Guide",
    blurb: "Use the WeChat JSSDK with TypeScript",
    title: "WeChat"
  }
]

const webFrameworks = [
  {
    href: "/docs/handbook/typescript-in-5-minutes.html",
    blurb: "Makes writing beautiful apps be joyful and fun",
    title: "Angular"
  },
  {
    href: "https://reactjs.org",
    badge: "Examples below",
    blurb: "A JavaScript library for building user interfaces",
    title: "React"
  },
  {
    href: "https://vuejs.org",
    blurb: "The Progressive JavaScript Framework",
    title: "Vue"
  },
  {
    href: "https://github.com/typescript-ruby/typescript-rails",
    badge: "Plugin",
    blurb: "Convention over configuration web framework",
    title: "Ruby on Rails"
  },
  {
    href: "https://www.typescriptlang.org/docs/handbook/asp-net-core.html",
    badge: "Guide",
    blurb: "Framework for building modern, cloud-based, Internet-connected applications",
    title: "ASP.NET Core"
  },
]

const nodeNPM = [
  {
    href: "https://github.com/jaredpalmer/tsdx#readme",
    blurb: "Zero config tool for building TypeScript libraries",
    title: "TSDX"
  },
  {
    href: "https://oclif.io",
    blurb: "Create command line tools your users love",
    title: "oclif"
  },
  {
    href: "https://github.com/infinitered/gluegun#readme",
    blurb: "A delightful toolkit for building TypeScript-powered command-line apps",
    title: "Gluegun"
  }
]


const react = [
  {
    href: "https://create-react-app.dev",
    blurb: "Set up a modern web app by running one command",
    title: "Create React App"
  },
  {
    href: "https://www.gatsbyjs.org",
    badge: "Plugin",
    blurb: "Helps developers build blazing fast websites and apps",
    title: "Gatsby"
  },
  {
    href: "https://nextjs.org",
    blurb: "The React Framework",
    title: "Next.js"
  },
  {
    href: "https://github.com/jaredpalmer/razzle",
    blurb: "Server-rendered universal JavaScript applications with no configuration",
    title: "Razzle"
  },
  {
    href: "https://reactjs.org/community/starter-kits.html",
    blurb: "Recommendations from the React Team",
    title: "Starter Kits"
  }
]

const apps = [
  {
    href: "https://babeljs.io/docs/en/babel-preset-typescript",
    badge: "Plugin",
    blurb: "Set up a modern web app by running one command",
    title: "Electron"
  },
  {
    href: "https://expo.io/",
    blurb: "The fastest way to build an app",
    title: "Expo"
  },
  {
    href: "https://facebook.github.io/react-native/",
    blurb: "Learn once, write anywhere",
    title: "React Native"
  },
  {
    href: "https://www.nativescript.org/",
    blurb: "Open source framework for building truly native mobile apps",
    title: "NativeScript"
  },
  {
    href: "https://www.microsoft.com/en-us/makecode/",
    blurb: "Brings computer science to life for all students with fun projects",
    title: "MakeCode"
  }
]


const tooling = [
  {
    href: "https://babeljs.io/docs/en/babel-preset-typescript",
    badge: "Plugin",
    blurb: "Use next generation JavaScript, today",
    title: "Babel"
  },
  {
    href: "https://parceljs.org",
    blurb: "Blazing fast, zero configuration web application bundler",
    title: "Parcel"
  },
  {

    href: "https://webpack.js.org/guides/typescript/",
    badge: "Plugin",
    blurb: "Bundle your assets, scripts, images and styles",
    title: "Webpack"
  }
]

const learn = [
  {
    href: "/docs/handbook/release-notes/typescript-3-5.html",
    blurb: "3.5 Release Notes",
    title: "Release Notes"
  },
  {
    href: "/docs/handbook/basic-types.html",
    blurb: "The TypeScript language reference",
    title: "Handbook"
  },
  {
    href: "/docs/handbook/declaration-files/introduction.html",
    blurb: "Learn how to declare the shape of JS",
    title: "d.ts Guide"
  },
  {
    href: "/play/index.html",
    blurb: "Explore and share TypeScript online",
    title: "Playground"
  }
]

const Index = () =>
  <Layout title="The starting point for learning TypeScript" description="Find TypeScript starter projects: from Angular to React or Node.js and CLIs."  >
    <div id="documentation" className="raised" style={{ backgroundColor: "white", maxWidth: 960, margin: "1rem auto", padding: "2rem" }}>
      <h1>Start Learning</h1>

      <ButtonGrid {...headlineGrid} />

      <h1>Start a Project</h1>
      <p>Because TypeScript is a super-set of JavaScript, it doesn't have a default template -  there would be too many.
      Instead, other projects have their own TypeScript bootstrap templates with their own context. These projects provide
      templates which include TypeScript support.</p>

      <h2>Node with NPM</h2>
      <ButtonGrid buttons={nodeNPM} />

      <h2>Web Frameworks</h2>
      <ButtonGrid buttons={webFrameworks} />

      <h2>Node APIs</h2>
      <ButtonGrid buttons={apis} />

      <h2>React Projects</h2>
      <ButtonGrid buttons={react} />

      <h2>Building Apps</h2>
      <ButtonGrid buttons={apps} />

      <h2>Tooling</h2>
      <ButtonGrid buttons={tooling} />

      <h1>Familiar With TypeScript already?</h1>
      <ButtonGrid buttons={learn} />
    </div >

  </Layout >

export default Index
