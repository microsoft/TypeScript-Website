import React from "react"
import { Layout } from "../components/layout"
import { Intl } from "../components/Intl"

import { indexCopy } from "../copy/en/index"
import { createInternational } from "../lib/createInternational"

import "./index.scss"
import "../pages/css/documentation.scss"

import { useIntl } from "react-intl"
import { VersionBar } from "../components/VersionBar"
import { GreyButton } from "../components/display/GreyButton"
import { withPrefix } from "gatsby"
import { UpcomingReleaseMeta } from "../components/UpcomingReleaseMeta"
import { MigrationStories } from "../components/MigrationStories"

const ts = () =>
  <svg fill="none" height="8" viewBox="0 0 14 8" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m6.72499 1.47255h-2.3375v6.32987h-1.71875v-6.32987h-2.337502v-1.117035h6.325002v1.117035zm5.29371 4.40609c0-.31029-.1375-.49646-.3437-.68264-.2063-.18617-.6188-.31028-1.1688-.49646-.96246-.24823-1.71871-.55852-2.26871-.93086-.48125-.37235-.75625-.80675-.75625-1.42732 0-.62058.275-1.11704.89375-1.489385.55-.372345 1.30625-.558518 2.20001-.558518.8937 0 1.65.24823 2.2.682633.55.4344.825.99292.825 1.6135h-1.5813c0-.37235-.1375-.62058-.4125-.86881-.275-.18617-.6187-.31029-1.1-.31029-.4125 0-.75621.06206-1.03121.24823-.275.18618-.34375.43441-.34375.68264s.1375.4344.4125.62057.68746.31029 1.37496.49646c.8938.24823 1.5813.55852 2.0625.93087.4813.37234.6875.8688.6875 1.48938 0 .62057-.275 1.17909-.825 1.48938-.55.37234-1.3062.55852-2.2.55852-.89371 0-1.71871-.18618-2.33746-.62058s-1.03125-.99292-.9625-1.79967h1.65c0 .4344.1375.74469.48125.99292.275.18617.75621.31029 1.23751.31029.4812 0 .825-.06206 1.0312-.24823.1375-.18617.275-.4344.275-.68263z" fill="#529bba" /></svg>

const js = () =>
  <svg fill="none" height="10" viewBox="0 0 12 10" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m2.83755.874988h1.85625v5.225002c0 2.3375-1.1 3.1625-2.95625 3.1625-.4125 0-1.031251-.06875-1.375001-.20625l.20625-1.5125c.275.1375.618751.20625.962501.20625.75625 0 1.30625-.34375 1.30625-1.65zm3.50625 6.325002c.48125.275 1.30625.55 2.0625.55.89375 0 1.30625-.34375 1.30625-.89375s-.4125-.825-1.375-1.16875c-1.375-.48125-2.26875-1.2375-2.26875-2.475 0-1.44375 1.16875-2.475002 3.1625-2.475002.9625 0 1.65.206249 2.1312.412502l-.4125 1.5125c-.3437-.1375-.8937-.4125-1.7187-.4125s-1.2375.34375-1.2375.825c0 .55.48125.75625 1.5125 1.16875 1.4437.55 2.1313 1.30625 2.1313 2.475 0 1.375-1.1001 2.54375-3.3688 2.54375-.9625 0-1.85625-.275-2.3375-.48125z" fill="#f1dd3f" /></svg>

const Section = (props: { children: any, color: string, className?: string }) =>
  <div key={props.color} className={props.color + " " + props.className}><div className="container">{props.children}</div></div>

type EditorProps = {
  title: string
  isJS: boolean
  front?: boolean
}

const Editor = (props: EditorProps) => {
  const classes = props.front ? "front" : "back"
  return (
    <div className={"editor " + classes}>
      <div className="titlebar">
        <div className="lang">{props.isJS ? js() : ts()}</div>
        <div className="window-name">index.ts</div>
      </div>
      <div className="content">
        <div className="lines"></div>
        <div className="text">{`function addPrices(items: number[]) {
let sum = 0
  for (const item of items) {
    sum += item
  }
  return sum
}

addPrices(3, 4, 6)`}
        </div>
      </div>
    </div>
  )
}

const Row = (props: { children: any }) => <div className="row">{props.children}</div>
const Col = (props: { children: any }) => <div className="col1">{props.children}</div>
const Col2 = (props: { children: any }) => <div className="col2">{props.children}</div>

const Index = (props: any) => {

  const i = createInternational<typeof indexCopy>(useIntl())

  return (
    <Layout title="JavaScript For Any Scale." description="Desc" lang="en">
      <VersionBar />

      <div id="index">
        <Section color="darkblue" className="headline">
          <Row>
            <Col>
              <h1>{i("index_headline", { bold: (...chunk) => <strong>{chunk}</strong> })}</h1>
              <p>{i("index_byline")}</p>
              <p>{i("index_summary")}</p>
              <p>{i("index_locations")}</p>
            </Col>
            <Col2>
              <div className='headline-diagram'>
                <Editor title="index.js" isJS />
                <Editor title="index.js" isJS={false} front />
              </div>
            </Col2>
          </Row>
        </Section>
        <Section color="white">
          <h3>{i("index_what_is")}</h3>
          <Row>
            <Col key='what is js'>
              <h4>{i("index_what_is_js")}</h4>
              <div>{i("index_what_is_js_copy", { p: (...chunk) => <p>{chunk}</p> })}</div>
            </Col>
            <Col key='you can trust typescipt'>
              <h4>{i("index_trust")}</h4>
              <div>{i("index_trust_copy", {
                p: (...chunk) => <p>{chunk}</p>,
                babel: (...chunk) => <a href='https://babeljs.io/'>{chunk}</a>
              })}</div>
            </Col>
            <Col key='TS improves JS'>
              <h4>{i("index_standards")}</h4>
              <div>{i("index_standards_copy", { p: (...chunk) => <p>{chunk}</p> })}</div>
            </Col>
          </Row>
        </Section>

        <Section color="blue">
          <Row>
            <Col key='dts description'>
              <h4>{i("index_dts")}</h4>
              <div>{i("index_dts_copy", {
                p: (...chunk) => <p>{chunk}</p>,
                dt: (...chunk) => <a href='https://github.com/DefinitelyTyped/DefinitelyTyped'>{chunk}</a>
              })}</div>
            </Col>
            <Col key='tools description'>
              <h4>{i("index_tools")}</h4>
              <div>{i("index_tools_copy", {
                p: (...chunk) => <p>{chunk}</p>,
                vs: (...chunk) => <a key={1} href='https://visualstudio.microsoft.com'>{chunk}</a>,
                vsc: (...chunk) => <a key={2} href='https://code.visualstudio.com/'>{chunk}</a>,
                atom: (...chunk) => <a key={3} href='https://atom.io/'>{chunk}</a>,
                nova: (...chunk) => <a key={4} href='https://panic.com/nova/'>{chunk}</a>,
                subl: (...chunk) => <a key={5} href='https://www.sublimetext.com//'>{chunk}</a>,
                emacs: (...chunk) => <a key={6} href='https://github.com/ananthakumaran/tide/#readme'>{chunk}</a>,
                vim: (...chunk) => <a key={7} href='https://www.vimfromscratch.com/articles/setting-up-vim-for-typescript/'>{chunk}</a>,
                webs: (...chunk) => <a key={8} href='https://www.jetbrains.com/webstorm/'>{chunk}</a>,
                eclipse: (...chunk) => <a key={9} href='https://github.com/eclipse/wildwebdeveloper/'>{chunk}</a>
              })}</div>
            </Col>
            <Col key='why trust ts'>
              <h4>{i("index_trust")}</h4>
              <div>{i("index_trust_copy", { p: (...chunk) => <p>{chunk}</p> })}</div>
            </Col>
          </Row>
        </Section>

        <Section color="white">
          <Row key='what is ts?'><h3>{i("index_what_is")}</h3></Row>
          <Row key='call to actions'>
            <GreyButton href={withPrefix("/docs/handbook")} title={i("index_started_handbook")} blurb={i("index_started_handbook_blurb")} />
            <GreyButton href={withPrefix("/docs/handbook")} title={i("index_started_guides")} blurb={i("index_started_guides_blurb")} />
            <GreyButton href={withPrefix("/docs/handbook")} title={i("index_started_ref")} blurb={i("index_started_ref_blurb")} />
            <GreyButton href={withPrefix("/docs/handbook")} title={i("index_started_community")} blurb={i("index_started_community_blurb")} last />
          </Row>

          <Row key="overall info">
            <Col key="installation">
              <h4>{i("index_install")}</h4>
              <div className='grey-box'>
                {i("index_install_ref", {
                  p: (...chunk) => <p>{chunk}</p>,
                  pre: (...chunk) => <pre>{chunk}</pre>,
                  code: (...chunk) => <code>{chunk}</code>,
                })}
              </div>
            </Col>

            <Col key="releases">
              <h4>{i("index_releases")}</h4>
              <UpcomingReleaseMeta />
            </Col>
          </Row>
        </Section>

        <Section color="purple" className="migrations">
          <h3>{i("index_migration_title")}</h3>

          <MigrationStories />

        </Section>

        <Section color="light-grey">
          <Row key='what is ts?'>
            <Col>
              <ul>
                <li>
                  <a href="https://www.youtube.com/watch?v=jmPZztKIFf4">
                    <p>TSConf Keynote: 2019<br />By Anders Hejlsberg</p>
                  </a>
                  <a href="https://www.youtube.com/watch?v=Au-rrY0afe4">
                    <p>What’s new in TypeScript?<br />by Daniel Rosenwasser</p>
                  </a>
                  <a href="#">
                    <p>What’s new in TypeScript 2019<br />By Anders Hejlsberg</p>
                  </a>
                </li>
              </ul>

            </Col>
            <Col2>
              <div className='headline-diagram'>
                <Editor title="index.js" isJS />
                <Editor title="index.js" isJS={false} front />
              </div>
            </Col2>
          </Row>

        </Section>
      </div>

    </Layout >)

}



export default (props: any) => <Intl><Index {...props} /></Intl>

