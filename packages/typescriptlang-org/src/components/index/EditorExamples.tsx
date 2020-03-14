import React, { useState } from "react"

import { indexCopy } from "../../copy/en/index"
import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"

const ts = () =>
  <svg fill="none" height="8" viewBox="0 0 14 8" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m6.72499 1.47255h-2.3375v6.32987h-1.71875v-6.32987h-2.337502v-1.117035h6.325002v1.117035zm5.29371 4.40609c0-.31029-.1375-.49646-.3437-.68264-.2063-.18617-.6188-.31028-1.1688-.49646-.96246-.24823-1.71871-.55852-2.26871-.93086-.48125-.37235-.75625-.80675-.75625-1.42732 0-.62058.275-1.11704.89375-1.489385.55-.372345 1.30625-.558518 2.20001-.558518.8937 0 1.65.24823 2.2.682633.55.4344.825.99292.825 1.6135h-1.5813c0-.37235-.1375-.62058-.4125-.86881-.275-.18617-.6187-.31029-1.1-.31029-.4125 0-.75621.06206-1.03121.24823-.275.18618-.34375.43441-.34375.68264s.1375.4344.4125.62057.68746.31029 1.37496.49646c.8938.24823 1.5813.55852 2.0625.93087.4813.37234.6875.8688.6875 1.48938 0 .62057-.275 1.17909-.825 1.48938-.55.37234-1.3062.55852-2.2.55852-.89371 0-1.71871-.18618-2.33746-.62058s-1.03125-.99292-.9625-1.79967h1.65c0 .4344.1375.74469.48125.99292.275.18617.75621.31029 1.23751.31029.4812 0 .825-.06206 1.0312-.24823.1375-.18617.275-.4344.275-.68263z" fill="#719af4" /></svg>

const js = () =>
  <svg fill="none" height="10" viewBox="0 0 12 10" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m2.83755.874988h1.85625v5.225002c0 2.3375-1.1 3.1625-2.95625 3.1625-.4125 0-1.031251-.06875-1.375001-.20625l.20625-1.5125c.275.1375.618751.20625.962501.20625.75625 0 1.30625-.34375 1.30625-1.65zm3.50625 6.325002c.48125.275 1.30625.55 2.0625.55.89375 0 1.30625-.34375 1.30625-.89375s-.4125-.825-1.375-1.16875c-1.375-.48125-2.26875-1.2375-2.26875-2.475 0-1.44375 1.16875-2.475002 3.1625-2.475002.9625 0 1.65.206249 2.1312.412502l-.4125 1.5125c-.3437-.1375-.8937-.4125-1.7187-.4125s-1.2375.34375-1.2375.825c0 .55.48125.75625 1.5125 1.16875 1.4437.55 2.1313 1.30625 2.1313 2.475 0 1.375-1.1001 2.54375-3.3688 2.54375-.9625 0-1.85625-.275-2.3375-.48125z" fill="#f1dd3f" /></svg>


export const EditorExamples = () => {
  const i = createInternational<typeof indexCopy>(useIntl())

  // Controls which story we should show
  const [index, setIndex] = useState(0);

  const explanations = [
    "Validate your function arguments",
    "Document your React Props via types",
    "Get completions for un-typed JavaScript code",
    "Catch typos in your editor ahead of runtime",
    "Offer instant fixes for common bugs",
    "Opt-in to strict nullability checking",
    "Use exact strings and numbers for type-checking",
    "Declare code to be read-only to avoid changes"
  ]

  const loadIndex = (index: number) => {
    setIndex(index)
  }

  const next = (e) => {
    if (index + 1 === explanations.length) loadIndex(0)
    else loadIndex(index + 1)

    e.preventDefault()
    return false
  }

  return (
    <div className='headline-diagram'>

      <div className="slides">
        {{
          0: (
            <WrongArguments />
          ),
          1: (
            <ReactExample />
          ),
          2: (
            <TypeDefinitions />
          ),
          3: (
            <Typos />
          ),
          4: (
            <DidYouMean />
          ),
          5: (
            <Strict />
          ),
          6: (
            <Literals />
          ),
          7: (
            <Mutation />
          )
        }[index]}
      </div>

      <div style={{ position: "absolute", left: "50%", bottom: "-8px" }}>
        <a className="next-headline-button" href="#" onClick={next} role="presentation">
          <div className="message">{explanations[index]}</div>
          <div className="next">
            <p>Next</p>
            <p style={{ margin: 0 }}><svg width="11" height="15" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0 14.5V0.5L10.5 7L0 14.5Z" fill="#08446E" /></svg></p>
          </div>
        </a>
      </div>
    </div >
  )
}

const WrongArguments = () => {
  const js = `
function addPrices(items) {
  let sum = 0;
  for (const item of items) {
    sum += item;
  }
  return sum;
}

addPrices(3, 4, 6);
  `

  const ts = `
  function addPrices(items<span class='highlight'>: number[]</span>) { 
    let sum = 0;
    for (const item of items) {
      sum += item;
    }
    return sum;
 }
 
 addPrices(3, 4, 6);
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "166px" }} />}

        inline={() =>
          (<>
            <div className="underline-error" style={{ top: "140px", left: "96px", width: "68px" }} />
            <div className="error-message" style={{ top: "170px", left: "96px", width: "200px" }}>
              Expected 1 argument,<br />but got 3.
          </div>
          </>)
        } />
    </div>
  )
}



const ReactExample = () => {
  const js = `
import React from "react";

export const UserThumbnail = (props) =>

  &lt;a href={props.url}>
    &lt;img src={props.img} alt={props.alt} />
  &lt;/a>
`

  const ts = `
import React from "react"

interface <span class='highlight'>UserThumbnailProps</span> {
  img: string
  alt: string
  url: string
}

export const UserThumbnail = 
  (props<span class='highlight'>: UserThumbnailProps</span>) =>

  &lt;a href={props.url}>
    &lt;img src={props.img} alt={props.alt} />
  &lt;/a>
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts} />
    </div>
  )
}

const TypeDefinitions = () => {
  const js = `
const express = require('express')
const app = express()
  
app.get('/', function (req, res) {
  res.se|`

  const ts = `
const express = require('express')    
const app = express()
  
app.get('/', function (req, res) {
  res.se<span class='highlight'>|</span>
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts} inline={() =>
        (<>
          <ul className="dropdown" style={{ top: "96px", left: "78px" }}>
            <li><span className='result'><span className='result-found'>se</span>nd</span>Send a response.</li>
            <li><span className='result'><span className='result-found'>se</span>ndData</span>Boolean which declares to send data.</li>
            <li><span className='result'><span className='result-found'>se</span>ndFile</span>Transfers a file at the given path.</li>
            <li><span className='result'><span className='result-found'>se</span>ndStatus</span>Set the HTTP response status code to statusCode and send its string representation as the response body.</li>
          </ul>
        </>)
      } />
    </div>
  )
}

const Typos = () => {
  const js = `
const users = [
  { name: "Ahmed" },
  { name: "Gemma" },
  { name: "Jon" }
];

const jon = users.find(u => u.name === "Jon")
console.log(jon.naem)
  `

  const ts = `
const users = [
  { name: "Ahmed" },
  { name: "Gemma" },
  { name: "Jon" }
];

const jon = users.find(u => u.name === "Jon")
console.log(jon.naem)
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "152px" }} />}

        inline={() =>
          (<>
            <div className="underline-error" style={{ top: "122px", left: "138px", width: "40px" }} />
            <div className="error-message" style={{ top: "150px", left: "18px", width: "240px" }}>Property 'naem' does not exist<br />on type '&#123; name: string; }'.</div>
          </>)
        } />
    </div>
  )
}

const DidYouMean = () => {
  const js = `
const getUserAccountID = async () => {
  const me = fetch("/api/me")
  return me.json().id
}
  `

  const ts = `
const getUserAccountID = async () => {
  const me = fetch("/api/me")
  return me.json().id
}
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "80px" }} />}

        inline={() =>
          (<>
            <div className="underline-error" style={{ top: "48px", left: "108px", width: "45px" }} />
            <div className="error-message" style={{ top: "74px", left: "70px", width: "240px" }}>Property 'json' does not exist<br />on type 'Promise&lt;Response>'</div>
            <div className="did-you-mean-icon" style={{ top: "126px", left: "50px", width: "200px" }}><svg width="10" height="13" viewBox="0 0 10 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M7.6708 7.65806C7.3319 7.9916 7.0716 8.36278 6.8886 8.77172C6.7105 9.1792 6.621 9.6219 6.621 10.1009V11.7012C6.621 11.8807 6.5872 12.0503 6.5189 12.2091C6.4513 12.3661 6.3586 12.5038 6.2407 12.6213C6.1228 12.7388 5.98464 12.8311 5.82723 12.8984C5.66806 12.9663 5.49806 13 5.31823 13H3.71205C3.53223 13 3.36223 12.9663 3.20306 12.8984C3.04564 12.8311 2.90753 12.7388 2.78961 12.6213C2.67168 12.5038 2.57895 12.3661 2.51141 12.2091C2.44311 12.0503 2.40927 11.8807 2.40927 11.7012V10.1009C2.40927 9.622 2.31772 9.1795 2.13553 8.77209C1.95683 8.36336 1.69832 7.99156 1.35953 7.65806C0.92468 7.22903 0.58896 6.75003 0.35361 6.22134C0.11756 5.69107 0 5.11672 0 4.49953C0 4.08664 0.05342 3.68802 0.16048 3.30397C0.26728 2.92089 0.41907 2.56286 0.61595 2.23018C0.81257 1.89377 1.04777 1.58911 1.32146 1.31641C1.59503 1.04383 1.89858 0.80953 2.23195 0.61364C2.56979 0.41764 2.93146 0.2662 3.31578 0.15983C3.70106 0.0532 4.10094 0 4.51514 0C4.92934 0 5.32923 0.0532 5.71451 0.15983C6.0988 0.2662 6.458 0.41739 6.7918 0.61351C7.1294 0.80938 7.4351 1.0437 7.7088 1.31641C7.9825 1.5891 8.2177 1.89376 8.4143 2.23016C8.6112 2.56285 8.763 2.92088 8.8698 3.30397C8.9769 3.68802 9.0303 4.08664 9.0303 4.49953C9.0303 5.11672 8.9127 5.69107 8.6767 6.22134C8.4413 6.75003 8.1056 7.22903 7.6708 7.65806ZM5.62162 9.5H3.40867V11.7012C3.40867 11.7823 3.4372 11.8512 3.49888 11.9127C3.56058 11.9741 3.63007 12.0028 3.71205 12.0028H5.31823C5.40022 12.0028 5.46971 11.9741 5.5314 11.9127C5.59309 11.8512 5.62162 11.7823 5.62162 11.7012V9.5Z" fill="white" /></svg></div>
            <div className="did-you-mean" style={{ top: "126px", left: "70px", width: "200px" }}>{`add 'await'?`}</div>
          </>)
        } />
    </div>
  )
}


const Strict = () => {
  const js = `
const users = [
  { name: "Ahmed" },
  { name: "Gemma" },
  { name: "Jon" }
];

const jon = 
  users.find(u => u.name === "John")

console.log(jon.naem)
  `

  const ts = `
const users = [
  { name: "Ahmed" },
  { name: "Gemma" },
  { name: "Jon" }
];

const jon = 
  users.find(u => u.name === "John")
  
console.log(jon.naem)
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "184px" }} />}
        inline={() =>
          (<>
            <div className="underline-error" style={{ top: "152px", left: "108px", width: "30px" }} />
            <div className="error-message" style={{ top: "180px", left: "60px" }}>{`Object is possibly 'undefined'.`}</div>
          </>)
        } />
    </div>
  )
}


const Literals = () => {
  const js = `
function getLength(value, from, to) {
  if (from === "cm" && to === "in") {
    // ...
  }
  // ...
}

const dist = getLength(3, "cm", "inches");
  `

  const ts = `
  <span class='highlight'>type Unit = "mm" | "cm" | "in"</span> 

function getLength(
  value<span class='highlight'>: number</span>, from<span class='highlight'>: Unit</span>, to<span class='highlight'>: Unit</span>) {
 // ...
}

const dist = getLength(3, "cm", "inches");
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "152px" }} />}
        inline={() =>
          (<>
            <div className="underline-error" style={{ top: "124px", left: "266px", width: "55px" }} />
            <div className="error-message" style={{ top: "153px", left: "16px", width: "320px" }}>
              Argument of type '"inches"' is not<br />assignable to parameter of type 'Unit'.
          </div>
          </>)
        } />
    </div>
  )
}



const Mutation = () => {
  const js = `
const adminUserIDs 
  = [1, 23, 88]

function isAdmin(userID) {
  for (let index = 0; index < adminUserIDs.length; index++) {
    if (adminUserIDs[index] = userID) {
      return true
    };
    return false
  }
}
  `

  const ts = `
const adminUserIDs
   <span class='highlight'>: readonly number[]</span> = [1, 23, 88]

function isAdmin(userID<span class='highlight'>: number</span>) {
  for (let index = 0; index < adminUserIDs.length; index++) {
    if (adminUserIDs[index] = userID) {
      return true
    };
    return false
  }
}  
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "124px" }} />}
        inline={() =>
          (<>
            <div className="underline-error" style={{ top: "90px", left: "76px", width: "144px" }} />
            <div className="error-message" style={{ top: "174px", left: "40px", width: "200px" }}>
              Index signature in type 'readonly<br />number[]'only permits reading.
          </div>
          </>)
        } />
    </div>
  )
}


type EditorProps = {
  title: string
  isJS?: boolean
  front?: boolean
  code: string
  inline?: () => JSX.Element
  line?: () => JSX.Element
}


const Editor = (props: EditorProps) => {
  const classes = ["editor"]
  classes.push(props.front ? "front" : "back")
  classes.push(props.isJS ? "js" : "ts")
  return (
    <div className={classes.join(" ")}>
      <div className="editor-inner">
        <div className="titlebar">
          <div className="lang">{props.isJS ? js() : ts()}</div>
          <div className="window-name">{props.title}</div>
        </div>
        <div className="content">
          <div className="lines"></div>
          <div className="text">
            <div dangerouslySetInnerHTML={{ __html: props.code.trim() }} />
            {props.inline && props.inline() || null}
          </div>
        </div>
        {props.line && props.line() || null}
      </div>
    </div>
  )
}
