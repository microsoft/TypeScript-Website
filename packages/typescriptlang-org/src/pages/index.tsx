import React, { useEffect } from "react"
import { withPrefix } from "gatsby"
import { Layout } from "../components/layout"
import { Intl } from "../components/Intl"
import { VersionBar } from "../components/VersionBar"
import { GreyButton } from "../components/display/GreyButton"
import { UpcomingReleaseMeta } from "../components/index/UpcomingReleaseMeta"
import { MigrationStories, GitHubBar } from "../components/index/MigrationStories"

import { indexCopy } from "../copy/en/index"
import { createInternational } from "../lib/createInternational"
import { useIntl } from "react-intl"

import "./index.scss"
import "../pages/css/documentation.scss"
import { EditorExamples } from "../components/index/EditorExamples"

const Section = (props: { children: any, color: string, className?: string }) =>
  <div key={props.color} className={props.color + " " + props.className}><div className="container">{props.children}</div></div>

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>
const Col = (props: { children: any, className?: string }) => <div className={[props.className, "col1"].join(" ")}>{props.children}</div>
const Col2 = (props: { children: any }) => <div className="col2">{props.children}</div>

const Index = (props: any) => {

  const i = createInternational<typeof indexCopy>(useIntl())

  useEffect(() => {
    setupVideosSection()

  }, [])

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
              <EditorExamples />
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
              <div>
                <p>{i("index_trust_copy_a")}</p>
                <p>{i("index_trust_copy_b", {
                  p: (...chunk) => <p>{chunk}</p>,
                  babel: (...chunk) => <a key={1} href='https://babeljs.io/'>{chunk}</a>
                })}
                </p>
              </div>
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
              <h4>{i("index_standards")}</h4>
              <div>{i("index_standards_copy", { p: (...chunk) => <p>{chunk}</p> })}</div>
            </Col>
          </Row>
        </Section>

        <Section color="white">
          <h3>{i("index_started_title")}</h3>
          <Row key='call to actions'>
            <GreyButton href={withPrefix("/docs/handbook")} title={i("index_started_handbook")} blurb={i("index_started_handbook_blurb")} first />
            <GreyButton href={withPrefix("/docs/handbook")} title={i("index_started_guides")} blurb={i("index_started_guides_blurb")} />
            <GreyButton href={withPrefix("/docs/handbook")} title={i("index_started_ref")} blurb={i("index_started_ref_blurb")} />
            <GreyButton href={withPrefix("/docs/handbook")} title={i("index_started_community")} blurb={i("index_started_community_blurb")} />
          </Row>

          <Row key="overall info">
            <Col key="installation">
              <h4>{i("index_install")}</h4>
              <div className='grey-box'>
                {i("index_install_ref", {
                  p: (...chunk) => <p>{chunk}</p>,
                  pre: (...chunk) => <pre>{chunk}</pre>,
                  code: (...chunk) => <code key={chunk}>{chunk}</code>,
                })}
              </div>
            </Col>

            <Col key="releases" className="last">
              <h4>{i("index_releases")}</h4>
              <UpcomingReleaseMeta />
            </Col>
          </Row>
        </Section>

        <Section color="purple" className="migrations">
          <h3 id='migration_title'>{i("index_migration_title")}</h3>
          <div className="github-bar left">
            <GitHubBar left />
          </div>
          <div className="github-bar right">
            <GitHubBar left={false} />
          </div>
          <MigrationStories />

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
                  <a href="https://www.youtube.com/watch?v=P-J9Eg7hJwE" target="_blank">
                    <p>Why I Was Wrong About TypeScript<br /><span>By TJ VanToll</span></p>
                  </a>
                </li>
              </ul>

            </Col>
            <Col2>
              <a id="videos-thumb-a" href="https://www.youtube.com/watch?v=jmPZztKIFf4">
                <img width="100%" src={withPrefix("/images/index/ts-conf-keynote.jpg")} alt="Preview thumbnail for video" />
              </a>
            </Col2>
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
    }
  }
}


export default (props: any) => <Intl><Index {...props} /></Intl>

