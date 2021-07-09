import React, { useEffect, useState } from "react"
import { withPrefix } from "gatsby"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"
import { VersionBar } from "../../components/VersionBar"
import { GreyButton } from "../../components/display/GreyButton"
import { UpcomingReleaseMeta } from "../../components/index/UpcomingReleaseMeta"
import { MigrationStories, GitHubBar, OSS } from "../../components/index/MigrationStories"

import { indexCopy } from "../../copy/en/index"
import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"

import "./index.scss"
import "../pages/css/documentation.scss"

import { EditorExamples } from "../../components/index/EditorExamples"
import { createIntlLink } from "../../components/IntlLink"
import { isTouchDevice } from "../../lib/isTouchDevice"
import { AboveTheFold } from "../../components/index/AboveTheFold"

const Section = (props: { children: any, color: string, className?: string }) =>
  <div key={props.color} className={props.color + " " + (props.className ?? "")}><div className="container">{props.children}</div></div>

const QuarterOrHalfRow = (props: { children: any, className?: string }) => <div className={[props.className, "split-row"].join(" ")}>{props.children}</div>
const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>
const Col = (props: { children: any, className?: string }) => <div className={[props.className, "col1"].join(" ")}>{props.children}</div>
const Col2 = (props: { children: any }) => <div className="col2">{props.children}</div>

type Props = {
  pageContext: any
}

const Index: React.FC<Props> = (props) => {
  const i = createInternational<typeof indexCopy>(useIntl())
  const Link = createIntlLink(props.pageContext.lang)

  useEffect(() => { setupVideosSection() }, [])

  return (
    <Layout title="Typed JavaScript at Any Scale." description="TypeScript extends JavaScript by adding types to the language. TypeScript speeds up your development experience by catching errors and providing fixes before you even run your code." lang={props.pageContext.lang} suppressCustomization>

      <div id="index">
        <VersionBar />
        <Section color="darkblue" className="headline">
          <AboveTheFold />
        </Section>
        <Section color="white">
          <h2>{i("index_what_is")}</h2>
          <Row>
            <Col key='what is js'>
              <h3>{i("index_what_is_js")}</h3>
              <div>{i("index_what_is_js_copy", { p: (...chunk) => <p>{chunk}</p> })}</div>
            </Col>
            <Col key='you can trust typescipt'>
              <h3>{i("index_trust")}</h3>
              <div>
                <p>{i("index_trust_copy_a")}</p>
                <p>{i("index_trust_copy_b", {
                  p: (...chunk) => <p>{chunk}</p>,
                  babel: (...chunk) => <a key={1} href='https://babeljs.io/' target="_blank">{chunk}</a>
                })}
                </p>
              </div>
            </Col>
            <Col key='TS improves JS'>
              <h3>{i("index_gradual")}</h3>
              <div>{i("index_gradual_copy", { p: (...chunk) => <p>{chunk}</p> })}</div>
            </Col>
          </Row>
        </Section>

        <Section color="blue">
          <Row>
            <Col key='dts description'>
              <h3>{i("index_dts")}</h3>
              <div>{i("index_dts_copy", {
                p: (...chunk) => <p>{chunk}</p>,
                dt: (...chunk) => <a href='https://github.com/DefinitelyTyped/DefinitelyTyped' target="_blank">{chunk}</a>
              })}</div>
            </Col>
            <Col key='tools description'>
              <h3>{i("index_tools")}</h3>
              <div>{i("index_tools_copy", {
                p: (...chunk) => <p>{chunk}</p>,
                vs: (...chunk) => <a key={1} href='https://visualstudio.microsoft.com' target="_blank">{chunk}</a>,
                vsc: (...chunk) => <a key={2} href='https://code.visualstudio.com/' target="_blank">{chunk}</a>,
                atom: (...chunk) => <a key={3} href='https://atom.io/' target="_blank">{chunk}</a>,
                nova: (...chunk) => <a key={4} href='https://panic.com/nova/' target="_blank">{chunk}</a>,
                subl: (...chunk) => <a key={5} href='https://www.sublimetext.com/' target="_blank">{chunk}</a>,
                emacs: (...chunk) => <a key={6} href='https://github.com/ananthakumaran/tide/#readme' target="_blank">{chunk}</a>,
                vim: (...chunk) => <a key={7} href='https://www.vimfromscratch.com/articles/setting-up-vim-for-typescript/' target="_blank">{chunk}</a>,
                webs: (...chunk) => <a key={8} href='https://www.jetbrains.com/webstorm/' target="_blank">{chunk}</a>,
                eclipse: (...chunk) => <a key={9} href='https://github.com/eclipse/wildwebdeveloper/' target="_blank">{chunk}</a>
              })}</div>
            </Col>
            <Col key='why trust ts'>
              <h3>{i("index_standards")}</h3>
              <div>{i("index_standards_copy", { p: (...chunk) => <p>{chunk}</p> })}</div>
            </Col>
          </Row>
        </Section>

        <Section color="purple" className="migrations">
          <h2 id='migration_title'>{i("index_migration_title")}</h2>
          <div className="github-bar left">
            <GitHubBar left />
          </div>
          <div className="github-bar right">
            <GitHubBar left={false} />
          </div>
          <MigrationStories />
        </Section>

        <Section color="dark-green" className="show-only-small">
          <h3>{i("index_migration_oss")}</h3>
          <OSS />
        </Section>

        <Section color="light-grey">
          <Row key='ts videos'>
            <Col>
              <h4>{i("index_videos_title")}</h4>

              <ul id="videos">
                <li className="video active" data-img={withPrefix("/images/index/ts-conf-keynote.jpg")}>
                  <a href="https://www.youtube.com/watch?v=jmPZztKIFf4" target="_blank">
                    <p>TSConf Keynote: 2019<br /><span>By Anders Hejlsberg</span></p>
                  </a>
                </li>
                <li className="video" data-img={withPrefix("/images/index/what-is-new-ts.jpg")}>
                  <a href="https://www.youtube.com/watch?v=Au-rrY0afe4" target="_blank">
                    <p>What’s new in TypeScript?<br /><span>by Daniel Rosenwasser</span></p>
                  </a>
                </li>
                <li className="video" data-img={withPrefix("/images/index/ts-at-scale.jpg")}>
                  <a href="https://www.youtube.com/watch?v=P-J9Eg7hJwE" target="_blank">
                    <p>Adopting TypeScript at Scale<br /><span>By Brie Bunge</span></p>
                  </a>
                </li>
                <li className="video" data-img={withPrefix("/images/index/wrong-ts.jpg")}>
                  <a href="https://www.youtube.com/watch?v=AQOEZVG2WY0" target="_blank">
                    <p>Why I Was Wrong About TypeScript<br /><span>By TJ VanToll</span></p>
                  </a>
                </li>
              </ul>

            </Col>
            <Col2>
              <a id="videos-thumb-a" href="https://www.youtube.com/watch?v=jmPZztKIFf4" target="_blank">
                <img width="100%" src={withPrefix("/images/index/ts-conf-keynote.jpg")} alt="Preview thumbnail for video" />
              </a>
            </Col2>
          </Row>

        </Section>


        <Section color="white">
          <h2>{i("index_started_title")}</h2>
          <QuarterOrHalfRow key='call to actions'>
            <GreyButton href="/docs/handbook" title={i("index_started_handbook")} blurb={i("index_started_handbook_blurb")} first customClass="white-theme" />
            <GreyButton href="/docs/bootstrap" title={i("index_started_docs")} blurb={i("index_started_docs_blurb")} customClass="white-theme" />
            <GreyButton href="/community" title={i("index_started_community")} blurb={i("index_started_community_blurb")} customClass="white-theme" />
            <GreyButton href="/tools" title={i("index_started_tooling")} blurb={i("index_started_tooling_blurb")} customClass="white-theme" />
          </QuarterOrHalfRow>

          <div id="installation" />
          <Row key="overall info">
            <Col key="installation">
              <h4>{i("index_install")}</h4>
              <div className='grey-box installation-panel'>
                {i("index_install_ref", {
                  p: (...chunk) => <p key={Math.random()}>{chunk}</p>,
                  pre: (...chunk) => <pre>{chunk}</pre>,
                  code: (...chunk) => <code key={1}>{chunk}</code>,
                  download: (...chunk) => <Link to="/download">{chunk}</Link>,
                  install: Installation
                })}
              </div>
            </Col>

            <Col key="releases" className="last">
              <h4>{i("index_releases")}</h4>
              <UpcomingReleaseMeta />
            </Col>
          </Row>
        </Section>

      </div>

    </Layout >)

}

const setupVideosSection = () => {
  const videosUL = document.getElementById("videos")!
  for (let index = 0; index < videosUL.children.length; index++) {
    const element = videosUL.children[index] as HTMLLIElement;

    element.onmouseover = () => {
      document.querySelectorAll('#videos li.active').forEach(i => i.classList.remove('active'))
      element.classList.add("active")

      const a = document.getElementById('videos-thumb-a')! as HTMLAnchorElement
      a.href = element.getElementsByTagName("a").item(0)!.href

      a.getElementsByTagName("img").item(0)!.src = element.getAttribute("data-img")!

      return false
    }

    const isSmall = window.innerWidth < 800
    if (isSmall) {
      element.onclick = element.onmouseover
    }
  }
}

/** The "npm install typescript" button */
const Installation = () => {
  let hasSentNPMTrack = false

  const onclick = () => {
    var text = "npm install typescript";
    if (!hasSentNPMTrack) {
      hasSentNPMTrack = true
      // @ts-ignore
      window.appInsights &&
        // @ts-ignore
        window.appInsights.trackEvent({ name: "Copied npm instructions on Index", properties: { ab: "b" } })
    }
    navigator.clipboard.writeText(text).then(function () {
      const tooltip = document.querySelector(".installation-panel .tooltip") as HTMLElement
      tooltip.style.display = "block"
    }, function (err) {
      console.error('Async: Could not copy text: ', err);
    });
  }
  return (
    <div key="installation">
      <a onClick={onclick} className="flat-button"><code>npm install typescript <button aria-label="Copy npm install typescript to clipboard"><svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M433.941 65.941l-51.882-51.882A48 48 0 0 0 348.118 0H176c-26.51 0-48 21.49-48 48v48H48c-26.51 0-48 21.49-48 48v320c0 26.51 21.49 48 48 48h224c26.51 0 48-21.49 48-48v-48h80c26.51 0 48-21.49 48-48V99.882a48 48 0 0 0-14.059-33.941zM266 464H54a6 6 0 0 1-6-6V150a6 6 0 0 1 6-6h74v224c0 26.51 21.49 48 48 48h96v42a6 6 0 0 1-6 6zm128-96H182a6 6 0 0 1-6-6V54a6 6 0 0 1 6-6h106v88c0 13.255 10.745 24 24 24h88v202a6 6 0 0 1-6 6zm6-256h-64V48h9.632c1.591 0 3.117.632 4.243 1.757l48.368 48.368a6 6 0 0 1 1.757 4.243V112z"></path></svg></button></code></a>
      <div className="tooltip">Copied to clipboard</div>
    </div>
  )
}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>


