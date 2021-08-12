import React, { useEffect } from "react"
import {withPrefix} from "gatsby"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"
import { VersionBar } from "../../components/VersionBar"
import * as Adopt from "../../components/index/AdoptSteps"

import { MigrationStories, GitHubBar, OSS } from "../../components/index/MigrationStories2"

import { indexCopy } from "../../copy/en/index2"
import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"

import "../pages/css/index2.scss"
import "../pages/css/documentation.scss"

import { createIntlLink } from "../../components/IntlLink"
import { AboveTheFold } from "../../components/index/AboveTheFold2"

import {Code as Grad1} from "../../components/index/twoslash/generated/IndexAdoptGrad1"
import {Code as Grad2} from "../../components/index/twoslash/generated/IndexAdoptGrad2"

import {Code as Del1} from "../../components/index/twoslash/generated/Index2Del1TS"
import {Code as Del2} from "../../components/index/twoslash/generated/Index2Del2RM"
import {Code as Del3} from "../../components/index/twoslash/generated/Index2Del3JS.js"


const Section = (props: { children: any, color: string, className?: string }) =>
  <div key={props.color} className={props.color + " " + (props.className ?? "")}><div className="container">{props.children}</div></div>

const Row = (props: { children: any, className?: string, key?: string }) => <div key={props.key} className={[props.className, "row"].join(" ")}>{props.children}</div>
const Col = (props: { children: any, className?: string }) => <div className={[props.className, "col1"].join(" ")}>{props.children}</div>
const Col2 = (props: { children: any }) => <div className="col2">{props.children}</div>
const Half = (props: { children: any, className?: string }) => <div className={[props.className, "half"].join(" ")}>{props.children}</div>

type Props = {
  pageContext: any
}

const Index: React.FC<Props> = (props) => {
  const i = createInternational<typeof indexCopy>(useIntl())
  const Link = createIntlLink(props.pageContext.lang)


  useEffect(() => {
// Handles setting the scroll 
    window.addEventListener("scroll", updateOnScroll, { passive: true, capture: true });
 

    return () => {
      window.removeEventListener("scroll", updateOnScroll)
    }
  });

  /** Basically a <p> with bold set up */
  const P = (props: { ikey: keyof typeof indexCopy }) =>  <p key={props.ikey}>{i(props.ikey, { strong: (...chunk) => <strong>{chunk}</strong> })}</p>
  const GetStarted = (props: { href: string, title: any, subtitle: any, classes: string }) => (
    <Link to={props.href} className={"get-started " + props.classes} >
        <div> 
            <div className="fluid-button-title">{i(props.title)}</div>
            <div className="fluid-button-subtitle">{i(props.subtitle)}</div>
        </div>
        <div>
            <svg width="14" height="23" viewBox="0 0 14 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2L11 11.5L2 21" stroke="black" strokeWidth="4"/>
            </svg>
        </div>
    </Link>
  )


  return (
    <Layout title="JavaScript With Syntax For Types." description="TypeScript extends JavaScript by adding types to the language. TypeScript speeds up your development experience by catching errors and providing fixes before you even run your code." lang={props.pageContext.lang} suppressCustomization suppressDocRecommendations>

      <div id="index-2">
        <Section color="blue" className="headline">
          <AboveTheFold />
        </Section>
        <VersionBar />

        <Section color="white">
          <h2>{i("index_2_what_is")}</h2>
          <Row>
            <Col key='what is js'>
              <h3>{i("index_2_what_is_js")}</h3>
              <P ikey="index_2_what_is_js_copy" />
            </Col>
            <Col key='you can trust typescript'>
              <h3>{i("index_2_trust")}</h3>
              <P ikey="index_2_trust_copy" />
            </Col>
            <Col key='TS improves JS'>
              <h3>{i("index_2_scale")}</h3>
              <P ikey="index_2_scale_copy" /> 
            </Col>
          </Row>
        </Section>

        <Section color="light-grey">
            <h2 id='get_started'>{i("index_2_started_title")}</h2>
            <Row>
                <Col key='handbook'>
                    <GetStarted href="/docs/handbook/intro.html" classes="tall handbook" title="index_2_started_handbook" subtitle="index_2_started_handbook_blurb" />
                </Col>
                <Col key='playground'>
                    <GetStarted href="/play" classes="tall playground" title="nav_playground" subtitle="index_2_playground_blurb" />
                </Col>
                <Col key='download'>
                    <GetStarted href="/download" classes="tall download" title="nav_download" subtitle="index_2_install" />
                </Col>
            </Row>
        </Section>
        
        <div id="get-started" className="animate">
          <Section color="white">
              <h2 id='adopt-gradually'>{i("index_2_started_title")}</h2>
              <Half>
              <Row>
                    <Col key='handbook'>
                        <P ikey="index_2_adopt_blurb_1" />
                    </Col>
                    <Col key='playground'>
                        <P ikey="index_2_adopt_blurb_2" />
                    </Col>
                </Row>
              <Row>
                  <Col key='main'>
                      <Adopt.StepOne i={i} />
                      <Adopt.StepTwo i={i} />
                      <Adopt.StepThree i={i} />
                      <Adopt.StepFour i={i} />
                  </Col>
              </Row>
            </Half>
          </Section>
        </div>

        <Section color="light-grey">
            <Row>
                <Col key='title'>
                    <h3 id='describe-your-data'>{i("index_2_describe")}</h3>
                    <P ikey="index_2_describe_blurb1" />
                    <P ikey="index_2_describe_blurb2" />
                </Col>
                <Col key='ex1'>
                  <Grad1 />
                </Col>
                <Col key='ex2'>
                  <Grad2 />
                </Col>
            </Row>
        </Section>


        <Section color="white" className="via-delete">
            <h2 id='via-delete-key'>{i("index_2_transform")}</h2>
            <Row>
                <Col key='title'>
                  <Del1 />
                  <P ikey="index_2_transform_1"/>
                </Col>

                <Col key='ex1'>
                    <Del2 />
                    <P ikey="index_2_transform_2"/>
                </Col>

                <Col key='ex2'>
                  <Del3 />
                  <P ikey="index_2_transform_3"/>
                </Col>
            </Row>
        </Section>

        <Section color="light-grey" className="migrations">
          <h2 id='migration_title'>{i("index_2_migration_title")}</h2>
          <div className="github-bar left">
            <GitHubBar left />
          </div>
          <div className="github-bar right">
            <GitHubBar left={false} />
          </div>
          <MigrationStories />
        </Section>

        <Section color="dark-green" className="show-only-small">
          <h3>{i("index_2_migration_oss")}</h3>
          <OSS />
        </Section>

        <Section color="white">
          <h2>{i("index_2_loved_by")} </h2>
          <Row>
            <Col key='TS improves JS'>
                <img src={withPrefix("/images/index/stack-overflow.svg")}/>
              <div style={{ width: "60%", marginTop: "20px" }}>{i("index_2_loved_stack", { strong: (...chunk) => <strong>{chunk}</strong>, so: (...chunk) => <a href="https://insights.stackoverflow.com/survey/2020#most-loved-dreaded-and-wanted" target="_blank">{chunk}</a> })}</div>
            </Col>
            <div style={{ backgroundColor: "black", width: "1px" }} />
            <Col key='you'>
              <Row>
                <div style={{  width: "160px", textAlign: "center" }}>
                  <img src={withPrefix("/images/index/state-of-js.svg")}/>
                </div>
                <div style={{ flex: 1 }}>
                  <p>{i("index_2_loved_state_js", { strong: (...chunk) => <strong>{chunk}</strong>, js: (...chunk) => <a href="https://2020.stateofjs.com/en-US/technologies/javascript-flavors/" target="_blank">{chunk}</a>  })}</p>
                  <p>{i("index_2_loved_state_js2", { strong: (...chunk) => <strong>{chunk}</strong> })}</p>
                </div>
              </Row>
            </Col>
          </Row>
        </Section>


        <Section color="blue">
          <h2 id='get_started_blue'>{i("index_2_started_title")}</h2>
            <Row>
                <Col key='handbook'>
                    <GetStarted href="/docs/handbook/intro.html" classes="short handbook" title="index_2_started_handbook" subtitle="index_2_started_handbook_blurb" />
                </Col>
                <Col key='playground'>
                    <GetStarted href="/play" classes="short playground" title="nav_playground" subtitle="index_2_playground_blurb" />
                </Col>
                <Col key='download'>
                    <GetStarted href="/download" classes="short download" title="nav_download" subtitle="index_2_install" />
                </Col>
            </Row>
        </Section>

      </div>

    </Layout >)

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


const updateOnScroll = () => {
  const getStarted = document.getElementById("get-started")
}