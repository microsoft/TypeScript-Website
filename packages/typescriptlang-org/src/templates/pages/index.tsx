import React, { useEffect } from "react"
import {withPrefix} from "gatsby"
import { Layout } from "../../components/layout"
import { Intl } from "../../components/Intl"
import { VersionBar } from "../../components/VersionBar"
import * as Adopt from "../../components/index/AdoptSteps"

import { MigrationStories, GitHubBar, OSS } from "../../components/index/MigrationStories"

import { indexCopy } from "../../copy/en/index2"
import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"

import "../pages/css/index.scss"
import "../pages/css/documentation.scss"

import { createIntlLink } from "../../components/IntlLink"
import { AboveTheFold } from "../../components/index/AboveTheFold"

import {Code as Grad1} from "../../components/index/twoslash/generated/IndexAdoptGrad1"
import {Code as Grad2} from "../../components/index/twoslash/generated/IndexAdoptGrad2"

import {Code as Del1} from "../../components/index/twoslash/generated/Index2Del1TS"
import {Code as Del2} from "../../components/index/twoslash/generated/Index2Del2RM"
import {Code as Del3} from "../../components/index/twoslash/generated/Index2Del3JS.js"


const Section = (props: { children: any, color: string, className?: string }) =>
  <div key={props.color} className={props.color + " " + (props.className ?? "")}><div className="container">{props.children}</div></div>

const Row = (props: { children: any, className?: string, key?: string }) => <div key={props.key} className={[props.className, "row"].join(" ")}>{props.children}</div>
const Col = (props: { children: any, className?: string, role?: string }) => <div className={[props.className, "col1"].join(" ")}>{props.children}</div>
const Col2 = (props: { children: any }) => <div className="col2">{props.children}</div>
const Half = (props: { children: any, className?: string }) => <div className={[props.className, "half"].join(" ")}>{props.children}</div>

type Props = {
  pageContext: any
}

const Index: React.FC<Props> = (props) => {
  const i = createInternational<typeof indexCopy>(useIntl())
  const Link = createIntlLink(props.pageContext.lang)


  useEffect(() => {
    // NOOP on tiny devices where we need to re-orient the arrows.
    if (window.innerWidth < 900) return

    const adopt = document.getElementById("adopt-gradually-content")!
    adopt.classList.remove("no-js")
    adopt.classList.add("fancy-scroll")   

    updateOnScroll(i)()
    // Handles setting the scroll 
    window.addEventListener("scroll", updateOnScroll(i), { passive: true, capture: true });
 

    return () => {
      window.removeEventListener("scroll", updateOnScroll(i))
    }
  });

  /** Basically a <p> with bold set up */
  const P = (props: { ikey: keyof typeof indexCopy }) =>  <p key={props.ikey}>{i(props.ikey, { strong: (...chunk) => <strong>{chunk}</strong> })}</p>
  const GetStarted = (props: { role: string, href: string, title: any, subtitle: any, classes: string }) => (
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

        <Section color="light-grey" className="get-started-section">
            <h2 id='get_started'>{i("index_2_started_title")}</h2>
            <Row>
                <Col key='handbook' role="tablist">
                    <GetStarted role="tab" href="/docs/handbook/intro.html" classes="tall handbook" title="index_2_started_handbook" subtitle="index_2_started_handbook_blurb" />
                </Col>
                <Col key='playground' role="tablist">
                    <GetStarted role="tab" href="/play" classes="tall playground" title="nav_playground" subtitle="index_2_playground_blurb" />
                </Col>
                <Col key='download' role="tablist">
                    <GetStarted role="tab" href="/download" classes="tall download" title="nav_download" subtitle="index_2_install" />
                </Col>
            </Row>
        </Section>
        
        <div id="get-started" className="animate">
          <Section color="white">
              <Half>
               <div id='adopt-gradually-content' className='no-js'>
                   <h2 id='adopt-gradually'>{i("index_2_adopt")}</h2>
                    <div id='adopt-step-slider'>
                    <p id='adopt-step-blurb'></p>
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
                          <Adopt.StepperAll />
                      </Col>
                    </Row>
                  </div>
              </div>
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
                <img src={withPrefix("/images/index/stack-overflow.svg")} alt="Image of the stack overflow logo, and a graph showing TypeScript as the 2nd most popular language" />
                <div style={{ width: "60%", marginTop: "20px" }}>
                  <p>{i("index_2_loved_stack", { strong: (...chunk) => <strong>{chunk}</strong>, so: (...chunk) => <a href="https://insights.stackoverflow.com/survey/2020#most-loved-dreaded-and-wanted" target="_blank">{chunk}</a> })}</p>
                </div>
            </Col>
            <div style={{ backgroundColor: "black", width: "1px" }} />
            <Col key='you'>
              <Row>
                <div style={{  width: "160px", textAlign: "center" }}>
                  <img src={withPrefix("/images/index/state-of-js.svg")} alt="Logo of the State of JS survey"/>
                </div>
                <div style={{ flex: 1 }}>
                  <p>{i("index_2_loved_state_js", { strong: (...chunk) => <strong>{chunk}</strong>, js: (...chunk) => <a href="https://2020.stateofjs.com/en-US/technologies/javascript-flavors/" target="_blank">{chunk}</a>  })}</p>
                  <p>{i("index_2_loved_state_js2", { strong: (...chunk) => <strong>{chunk}</strong> })}</p>
                </div>
              </Row>
            </Col>
          </Row>
        </Section>


        <Section color="blue" className="get-started-section"> 
          <h2 id='get_started_blue'>{i("index_2_started_title")}</h2>
            <Row>
                <Col key='handbook' role="tablist">
                    <GetStarted role="tab" href="/docs/handbook/intro.html" classes="short handbook" title="index_2_started_handbook" subtitle="index_2_started_handbook_blurb" />
                </Col>
                <Col key='playground' role="tablist">
                    <GetStarted role="tab" href="/play" classes="short playground" title="nav_playground" subtitle="index_2_playground_blurb" />
                </Col>
                <Col key='download' role="tablist">
                    <GetStarted role="tab" href="/download" classes="short download" title="nav_download" subtitle="index_2_install" />
                </Col>
            </Row>
        </Section>

      </div>

    </Layout >)

}

export default (props: Props) => <Intl locale={props.pageContext.lang}><Index {...props} /></Intl>

// Recurses up to get the y pos of a node
// https://stackoverflow.com/questions/442404/retrieve-the-position-x-y-of-an-html-element-relative-to-the-browser-window
function getOffset( el ) {
  var _x = 0;
  var _y = 0;
  while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
      _x += el.offsetLeft - el.scrollLeft;
      _y += el.offsetTop - el.scrollTop;
      el = el.offsetParent;
  }
  return { top: _y, left: _x };
}


const updateOnScroll = (i: any) => () => {
  const adopt = document.getElementById("adopt-gradually-content") as HTMLDivElement
  if (!adopt) return

  const offset = getOffset(adopt).top
  const fromTop = window.scrollY
  const height =  adopt.scrollHeight
  
  const quarterHeight = (height - 200)/4 
  
  const startPoint = 100
  const y = fromTop - offset + startPoint

  const samples = adopt.getElementsByClassName("adopt-step")  as HTMLCollectionOf<HTMLDivElement>
  let index: 0 | 1| 2| 3 = 0
  if (y >= 0 && y < quarterHeight) index = 1
  else if (y >= (quarterHeight) && y < (quarterHeight * 2)) index = 2
  else if (y >= (quarterHeight * 2)) index =3
  samples.item(0)!.style.opacity = index === 0 ? "1" : "0"
  samples.item(1)!.style.opacity = index === 1 ? "1" : "0"
  samples.item(2)!.style.opacity = index === 2 ? "1" : "0"
  samples.item(3)!.style.opacity = index === 3 ? "1" : "0"
  
  const stepper = document.getElementById("global-stepper") as HTMLDivElement
  stepper.children.item(0)!.classList.toggle("active", index === 0)
  stepper.children.item(1)!.classList.toggle("active", index === 1)
  stepper.children.item(2)!.classList.toggle("active", index === 2)
  stepper.children.item(3)!.classList.toggle("active", index === 3)

  const msg = ["index_2_migrate_1", "index_2_migrate_2", "index_2_migrate_3", "index_2_migrate_4"]
  const blurb = document.getElementById("adopt-step-blurb")!
  blurb.innerText = i(msg[index]) 
}