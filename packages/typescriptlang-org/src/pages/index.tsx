import React from "react"
import { Layout } from "../components/layout"
import { Intl } from "../components/Intl"

import { indexCopy } from "../copy/en/index"
import { createInternational } from "../lib/createInternational"

import "./index.scss"
import { useIntl } from "react-intl"

const ts = () =>
  <svg fill="none" height="8" viewBox="0 0 14 8" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m6.72499 1.47255h-2.3375v6.32987h-1.71875v-6.32987h-2.337502v-1.117035h6.325002v1.117035zm5.29371 4.40609c0-.31029-.1375-.49646-.3437-.68264-.2063-.18617-.6188-.31028-1.1688-.49646-.96246-.24823-1.71871-.55852-2.26871-.93086-.48125-.37235-.75625-.80675-.75625-1.42732 0-.62058.275-1.11704.89375-1.489385.55-.372345 1.30625-.558518 2.20001-.558518.8937 0 1.65.24823 2.2.682633.55.4344.825.99292.825 1.6135h-1.5813c0-.37235-.1375-.62058-.4125-.86881-.275-.18617-.6187-.31029-1.1-.31029-.4125 0-.75621.06206-1.03121.24823-.275.18618-.34375.43441-.34375.68264s.1375.4344.4125.62057.68746.31029 1.37496.49646c.8938.24823 1.5813.55852 2.0625.93087.4813.37234.6875.8688.6875 1.48938 0 .62057-.275 1.17909-.825 1.48938-.55.37234-1.3062.55852-2.2.55852-.89371 0-1.71871-.18618-2.33746-.62058s-1.03125-.99292-.9625-1.79967h1.65c0 .4344.1375.74469.48125.99292.275.18617.75621.31029 1.23751.31029.4812 0 .825-.06206 1.0312-.24823.1375-.18617.275-.4344.275-.68263z" fill="#529bba" /></svg>

const js = () =>
  <svg fill="none" height="10" viewBox="0 0 12 10" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m2.83755.874988h1.85625v5.225002c0 2.3375-1.1 3.1625-2.95625 3.1625-.4125 0-1.031251-.06875-1.375001-.20625l.20625-1.5125c.275.1375.618751.20625.962501.20625.75625 0 1.30625-.34375 1.30625-1.65zm3.50625 6.325002c.48125.275 1.30625.55 2.0625.55.89375 0 1.30625-.34375 1.30625-.89375s-.4125-.825-1.375-1.16875c-1.375-.48125-2.26875-1.2375-2.26875-2.475 0-1.44375 1.16875-2.475002 3.1625-2.475002.9625 0 1.65.206249 2.1312.412502l-.4125 1.5125c-.3437-.1375-.8937-.4125-1.7187-.4125s-1.2375.34375-1.2375.825c0 .55.48125.75625 1.5125 1.16875 1.4437.55 2.1313 1.30625 2.1313 2.475 0 1.375-1.1001 2.54375-3.3688 2.54375-.9625 0-1.85625-.275-2.3375-.48125z" fill="#f1dd3f" /></svg>

const Section = (props: { children: any, color: string }) =>
  <div className={props.color}><div className="container">{props.children}</div></div>

type EditorProps = {
  title: string
  isJS: boolean
}

const Editor = (props: EditorProps) => {
  return (
    <div className="editor">
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

const Col = (props: { children: any }) => <div style={{ flex: 1 }}>{props.children}</div>
const Col2 = (props: { children: any }) => <div style={{ flex: 2 }}>{props.children}</div>

const Index = (props: any) => {

  const i = createInternational<typeof indexCopy>(useIntl())

  return (<Layout title="JavaScript For Any Scale." description="Desc">
    <div id="index">
      <Section color="darkblue">
        <Col>
          <h2>{i("index_headline", { span: (...chunk) => <strong>{chunk}</strong> })}</h2>
        </Col>
        <Col2>
          <Editor title="index.js" isJS />
          <Editor title="index.js" isJS={false} />

        </Col2>

      </Section>
    </div>

  </Layout>)

}



export default (props: any) => <Intl><Index {...props} /></Intl>

