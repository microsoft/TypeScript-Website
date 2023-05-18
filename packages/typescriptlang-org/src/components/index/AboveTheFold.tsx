import React, { useEffect, useState } from "react"

import { indexCopy } from "../../copy/en/index2"
import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"
import { EditorExamples } from "./EditorExamples"

const Row = (props: { children: any, className?: string }) => <div className={[props.className, "row"].join(" ")}>{props.children}</div>
const Col = (props: { children: any, className?: string }) => <div className={[props.className, "col1"].join(" ")}>{props.children}</div>
const Col2 = (props: { children: any }) => <div className="col2">{props.children}</div>

const event = (name: string, options?: any) => {
  // @ts-ignore
  window.appInsights &&
    // @ts-ignore
    window.appInsights.trackEvent({ name }, options)
}

const FluidButton = (props: { href?: string, onClick?: any, title: string, subtitle?: string, icon: JSX.Element, className?: string }) => (
  <a className={"fluid-button " + props.className || ""} href={props.href} onClick={props.onClick}>
    <div>
      <div className="fluid-button-title">{props.title}</div>
      <div className="fluid-button-subtitle">{props.subtitle}</div>
    </div>
    <div className="fluid-button-icon">
      {props.icon}
    </div>
  </a>
)

export const AboveTheFold = () => {
  const [showCTALinks, setShowCTALinks] = useState(false)
  const i = createInternational<typeof indexCopy>(useIntl())

  const Headline = () => {
    const onclick = (e) => {
      setShowCTALinks(true)
      e.preventDefault()
      event("Home Page CTA Started")
      return false
    }

    return (<Row>
      <Col>
        <h1>{i("index_2_headline", { bold: (...chunk) => <strong>{chunk}</strong> })}</h1>
        <p>{i("index_2_summary")}</p>

        <div className="call-to-action" style={{ justifyContent: "left" }}>
          <FluidButton
            title={i("index_2_cta_install")}
            subtitle={i("index_2_cta_install_subtitle")}
            href="/download"
            onClick={onclick}
            icon={
              <svg width="21" height="5" viewBox="0 0 21 5" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="0.5" y="0.5" width="4" height="4" stroke="black" />
                <rect x="8.5" y="0.5" width="4" height="4" stroke="black" />
                <rect x="16.5" y="0.5" width="4" height="4" stroke="black" />
              </svg>
            } />
        </div>
      </Col>
      <Col>
        <EditorExamples />
      </Col>
    </Row>)
  }

  const CTAHeadlines = () => (
    <div className="cta-redirects">
      <h2>Get Started With TypeScript</h2>
      <Row>
        <Col className="call-to-action">
          <img src={require("../../assets/index/play-light.png").default} width="100%"  />
          <FluidButton
            title={i("index_2_cta_play")}
            subtitle={i("index_2_cta_play_subtitle")}
            href="/play"
            onClick={() => event("Home Page CTA Exited", { link: "playground" })}
            icon={
              <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0)">
                  <path fillRule="evenodd" clipRule="evenodd" d="M24.5 16.5C24.5 25.3366 20.9182 32.5 16.5 32.5C12.0818 32.5 8.5 25.3366 8.5 16.5C8.5 7.66335 12.0818 0.5 16.5 0.5C20.9182 0.5 24.5 7.66335 24.5 16.5Z" stroke="black" strokeWidth="1.5" strokeLinecap="square" />
                  <path d="M2.5 8.60001H30.5" stroke="black" strokeWidth="1.5" />
                  <path d="M2.5 24.6H30.5" stroke="black" strokeWidth="1.5" />
                  <path d="M32 16.5C32 25.0605 25.0605 32 16.5 32C7.93949 32 1 25.0605 1 16.5C1 7.93949 7.93949 1 16.5 1C25.0605 1 32 7.93949 32 16.5Z" stroke="black" strokeWidth="1.5" />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="33" height="33" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            } />
        </Col>

        <Col className="call-to-action hide-small">
          <img src={require("../../assets/index/code-light.png").default} width="100%"  />
          <FluidButton
            title={i("index_2_cta_download")}
            subtitle={i("index_2_cta_download_subtitle")}
            href="/download"
            onClick={() => event("Home Page CTA Exited", { link: "download" })}
            icon={
              <svg width="15" height="27" viewBox="0 0 15 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 0.5V19M7.5 19L1 13M7.5 19L13 13" stroke="black" strokeWidth="1.5" />
                <path d="M0.5 25H14.5" stroke="black" strokeWidth="4" />
              </svg>
            } />
        </Col>
      </Row>
    </div>
  )

  const CTAHeadlineMobile = () => (
    <div>
      <h2>Get Started<br />With TypeScript</h2>
      <Row>
        <Col className="call-to-action flex-column">
          <div className="handbook-preview">
            <img src={require("../../assets/index/handbook.jpg").default} width={"100%"} />
          </div>
          <div className="inline-buttons">
            <a className='flat-button' href="/docs/handbook/intro.html">Web</a>
          </div>
        </Col>
      </Row>
    </div>
  )

  const CTALinks = () => {
    const Content = window.innerWidth < 600 ? CTAHeadlineMobile : CTAHeadlines
    return (
      <div className="cta">
        <a className="transparent-button" onClick={() => setShowCTALinks(false)}  href="#">
          <svg width="21" height="14" viewBox="0 0 21 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.25 7.75L1.75 7.75M1.75 7.75L7.75 1.25M1.75 7.75L7.75 13.25" stroke="white" strokeWidth="2" />
          </svg>
          Back</a>
        <Content />
      </div>
    )
  }

  return !showCTALinks ? <Headline /> : <CTALinks />
}
