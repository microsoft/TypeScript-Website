import React, { useState } from "react"

import { indexCopy } from "../../copy/en/index"
import { createInternational } from "../../lib/createInternational"
import { useIntl } from "react-intl"
import { ShowErrorsExample } from "./twoslash/showErrors"

const ts = () =>
  <svg fill="none" height="8" viewBox="0 0 14 8" width="14" xmlns="http://www.w3.org/2000/svg"><path d="m6.72499 1.47255h-2.3375v6.32987h-1.71875v-6.32987h-2.337502v-1.117035h6.325002v1.117035zm5.29371 4.40609c0-.31029-.1375-.49646-.3437-.68264-.2063-.18617-.6188-.31028-1.1688-.49646-.96246-.24823-1.71871-.55852-2.26871-.93086-.48125-.37235-.75625-.80675-.75625-1.42732 0-.62058.275-1.11704.89375-1.489385.55-.372345 1.30625-.558518 2.20001-.558518.8937 0 1.65.24823 2.2.682633.55.4344.825.99292.825 1.6135h-1.5813c0-.37235-.1375-.62058-.4125-.86881-.275-.18617-.6187-.31029-1.1-.31029-.4125 0-.75621.06206-1.03121.24823-.275.18618-.34375.43441-.34375.68264s.1375.4344.4125.62057.68746.31029 1.37496.49646c.8938.24823 1.5813.55852 2.0625.93087.4813.37234.6875.8688.6875 1.48938 0 .62057-.275 1.17909-.825 1.48938-.55.37234-1.3062.55852-2.2.55852-.89371 0-1.71871-.18618-2.33746-.62058s-1.03125-.99292-.9625-1.79967h1.65c0 .4344.1375.74469.48125.99292.275.18617.75621.31029 1.23751.31029.4812 0 .825-.06206 1.0312-.24823.1375-.18617.275-.4344.275-.68263z" fill="#719af4" /></svg>

const js = () =>
  <svg fill="none" height="10" viewBox="0 0 12 10" width="12" xmlns="http://www.w3.org/2000/svg"><path d="m2.83755.874988h1.85625v5.225002c0 2.3375-1.1 3.1625-2.95625 3.1625-.4125 0-1.031251-.06875-1.375001-.20625l.20625-1.5125c.275.1375.618751.20625.962501.20625.75625 0 1.30625-.34375 1.30625-1.65zm3.50625 6.325002c.48125.275 1.30625.55 2.0625.55.89375 0 1.30625-.34375 1.30625-.89375s-.4125-.825-1.375-1.16875c-1.375-.48125-2.26875-1.2375-2.26875-2.475 0-1.44375 1.16875-2.475002 3.1625-2.475002.9625 0 1.65.206249 2.1312.412502l-.4125 1.5125c-.3437-.1375-.8937-.4125-1.7187-.4125s-1.2375.34375-1.2375.825c0 .55.48125.75625 1.5125 1.16875 1.4437.55 2.1313 1.30625 2.1313 2.475 0 1.375-1.1001 2.54375-3.3688 2.54375-.9625 0-1.85625-.275-2.3375-.48125z" fill="#f1dd3f" /></svg>

const files = () => <svg fill="none" height="24" viewBox="0 0 21 24" width="21" xmlns="http://www.w3.org/2000/svg"><path d="m16.5 0h-9l-1.5 1.5v4.5h-4.5l-1.5 1.5v15.0699l1.5 1.4301h12.0699l1.4301-1.4301v-4.5699h4.7l1.3-1.4301v-12.0699zm0 2.12 2.38 2.38h-2.38zm-3 20.38h-12v-15h4.5v9.0699l1.5 1.4301h6zm6-6h-12v-15h7.5v4.5h4.5z" fill="#c5c5c5" /></svg>
const git = () => <svg fill="none" height="24" viewBox="0 0 20 24" width="20" xmlns="http://www.w3.org/2000/svg"><path d="m19.0068 8.22168c.0034-.69376-.1863-1.37479-.5479-1.96683-.3617-.59204-.8811-1.0717-1.4999-1.38528-.6189-.31357-1.3129-.44866-2.0041-.39016-.6914.05852-1.3526.30832-1.9101.72144-.5573.41312-.9887.97324-1.2457 1.61765-.257.6444-.3296 1.34763-.2095 2.03094.12.6833.4279 1.31976.8891 1.83796.4613.5182 1.0578.8978 1.7225 1.0962-.2454.4988-.6251.9194-1.0965 1.2143-.4713.295-1.0155.4526-1.5715.4553h-2.98946c-1.10669.0039-2.17233.4195-2.98944 1.1659v-7.22101c.90732-.18521 1.71357-.70072 2.26241-1.44658.54886-.74586.80116-1.66895.70809-2.5903-.09307-.92134-.52492-1.77531-1.21185-2.396337-.68693-.621028-1.57997-.964873-2.50601-.964873s-1.81908.343845-2.50601.964873c-.68692.621027-1.11879 1.474997-1.21186 2.396337-.09308.92135.15927 1.84444.70811 2.5903s1.35508 1.26137 2.2624 1.44658v9.11781c-.90562.1732-1.71656.6718-2.27986 1.4017-.5633.73-.840011 1.6409-.77796 2.5609.06206.9199.4586 1.7854 1.11483 2.433.65623.6477 1.52679 1.0329 2.44747 1.0829.92069.0501 1.82784-.2386 2.55037-.8114s1.21048-1.3902 1.37181-2.298c.16133-.9079-.01505-1.8433-.49598-2.63-.48091-.7867-1.23306-1.3702-2.11459-1.6405.24588-.4983.62578-.9182 1.09708-1.2126.47129-.2945 1.01531-.4516 1.57099-.454h2.98946c.9327-.0043 1.8408-.2993 2.5979-.844s1.3255-1.3119 1.6261-2.1948c.896-.1177 1.7189-.5563 2.3164-1.2343.5974-.678.929-1.54947.9332-2.45312zm-16.44193-4.48416c0-.44344.13149-.87692.37785-1.24562.24637-.36871.59653-.65609 1.00621-.82579.4097-.16969.8605-.21409 1.29542-.12757.43492.0865.83442.30003 1.14798.6136.31356.31356.5271.71306.61361 1.14798s.04211.88573-.12759 1.29541-.45707.75986-.82578 1.00622-.80219.37785-1.24563.37785c-.59464 0-1.16491-.23621-1.58539-.65669-.42047-.42046-.65668-.99075-.65668-1.58539zm4.48415 16.44188c0 .4435-.1315.8769-.37786 1.2456-.24637.3687-.59653.6561-1.00621.8258-.40969.1697-.8605.2141-1.29541.1276-.43493-.0864-.83442-.3-1.14799-.6136-.31356-.3136-.52709-.7131-.61361-1.1479-.0865-.435-.04211-.8858.12759-1.2955s.45708-.7599.82578-1.0062c.36871-.2463.80219-.3779 1.24563-.3779.59464 0 1.16492.2363 1.58539.6567.42047.4205.65669.9908.65669 1.5854zm8.22098-9.7156c-.4435 0-.8769-.1316-1.2456-.3779-.3687-.24636-.6561-.59653-.8258-1.00621-.1697-.40969-.2142-.86049-.1277-1.29542.0865-.43492.3001-.83442.6137-1.14798s.713-.5271 1.1479-.61361c.435-.08651.8858-.0421 1.2954.12759.4098.1697.7599.45707 1.0063.82578.2463.36871.3778.80218.3778 1.24563 0 .59464-.2362 1.16492-.6566 1.58538-.4206.42044-.9908.65674-1.5854.65674z" fill="#c5c5c5" /></svg>
const run = () => <svg fill="none" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="m10.94 13.5-1.32 1.32c-.20076-.8083-.66624-1.5261-1.32228-2.0391s-1.4649-.7917-2.29772-.7917-1.64168.2787-2.29772.7917-1.12152 1.2308-1.32228 2.0391l-1.32-1.32-1.06 1.06 1.72 1.72-.22.22v1.5h-1.5v1.5h1.5v.08c.0765.4887.21425.9658.41 1.42l-1.91 1.94 1.06 1.06 1.65-1.65c.39257.5009.89118.9086 1.46002 1.1938.56883.2853 1.19379.4411 1.82998.4562.63619-.0151 1.26115-.1709 1.82998-.4562.56884-.2852 1.06745-.6929 1.46002-1.1938l1.65 1.65 1.06-1.06-1.91-1.94c.1982-.4638.336-.9511.41-1.45v-.1h1.5v-1.45h-1.5v-1.5l-.22-.22 1.72-1.72zm-4.94 0c.59674 0 1.16903.2371 1.59099.659.42196.422.65901.9943.65901 1.591h-4.5c0-.5967.23705-1.169.65901-1.591.42196-.4219.99425-.659 1.59099-.659zm3 6c-.07326.7709-.41287 1.4921-.9604 2.0396s-1.26875.8871-2.0396.9604c-.77085-.0733-1.49207-.4129-2.0396-.9604s-.88714-1.2687-.9604-2.0396v-2.25h6zm14.76-9.9v1.26l-10.26 6.51v-1.77l8.5-5.37-13-8.23v9.46c-.45694-.321-.96376-.5642-1.5-.72v-10.11l1.14-.63z" fill="#c5c5c5" /></svg>
const search = () => <svg fill="none" height="24" viewBox="0 0 23 24" width="23" xmlns="http://www.w3.org/2000/svg"><path d="m14.25.00000103c-1.5895-.00079233-3.1454.45757297-4.48059 1.32006897-1.33519.86249-2.39284 2.09233-3.04566 3.54163-.65281 1.44929-.87298 3.05631-.63415 4.6278.23883 1.5715.92644 3.0406 1.98035 4.2305l-8.06995 9.16 1.12 1 8.05004-9.12c1.03546.8093 2.24916 1.3596 3.54026 1.605s2.6222.1787 3.8824-.1943c1.2601-.3731 2.4128-1.0419 3.3623-1.9506.9494-.9087 1.668-2.031 2.0959-3.2736.428-1.24254.5529-2.56947.3644-3.87008-.1886-1.30061-.6851-2.53727-1.4483-3.60718-.7631-1.06991-1.7708-1.94213-2.9392-2.543824-1.1683-.601697-2.4636-.91550084-3.7778-.9154052zm0 14.99999897c-1.335 0-2.6401-.3959-3.7501-1.1376-1.11005-.7417-1.97521-1.7959-2.48611-3.0293-.51089-1.23337-.6446-2.59062-.38415-3.89999.26045-1.30938.90341-2.51205 1.84741-3.45606.94405-.944 2.14665-1.58696 3.45605-1.84741s2.6666-.12674 3.9.38415c1.2334.5109 2.2876 1.37606 3.0293 2.48609s1.1376 2.4151 1.1376 3.75012c0 1.7902-.7112 3.5071-1.9771 4.773-1.2658 1.2658-2.9827 1.977-4.7729 1.977z" fill="#c5c5c5" /></svg>

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

addPrices(<span class='underline-error'>3, 4, 6</span>);
`

  return (
    <div>
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "166px" }} />}

        inline={() =>
          (<>
            <ShowErrorsExample />
          </>)
        } />
    </div>
  )
}



const ReactExample = () => {
  const js = `
import * as React from "react";

export const UserThumbnail = (props) =>

  &lt;a href={props.url}>
    &lt;img src={props.img} alt={props.alt} />
  &lt;/a>
`

  const ts = `
import * as React from "react"

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
      <Editor title="TypeScript Powered Editor" front code={ts} inline={() =>
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
const response = {
  data: {
    artworks: [
      { title: "Salvator Mundi" },
      { title: "The Starry Night" },
    ]
  }
};

const artworks = response.data.artworks
console.log(artworks[0].name)
  `

  const ts = `
const response = {
  data: {
    artworks: [
      { title: "Salvator Mundi" },
      { title: "The Starry Night" },
    ]
  }
};

const artworks = response.data.artworks
console.log(artworks[0].<span class='underline-error'>name</span>)
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "196px" }} />}

        inline={() =>
          (<>
            <div className="error-message" style={{ top: "186px", left: "18px", width: "240px" }}>Property 'name' does not exist<br />on type '&#123; title: string; &rbrace;'.</div>
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
  return me.<span class='underline-error'>json</span>().id
}
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "80px" }} />}

        inline={() =>
          (<>
            <div className="error-message" style={{ top: "74px", left: "70px", width: "240px" }}>Property 'json' does not exist<br />on type 'Promise&lt;Response&gt;'.</div>
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

console.log(jon.name)
  `

  const ts = `
const users = [
  { name: "Ahmed" },
  { name: "Gemma" },
  { name: "Jon" }
];

const jon = 
  users.find(u => u.name === "John")
  
console.log(<span class='underline-error'>jon</span>.name)
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "184px" }} />}
        inline={() =>
          (<>
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

const dist = getLength(3, "cm", <span class='underline-error'>"inches"</span>);
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "152px" }} />}
        inline={() =>
          (<>
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
  }
  return false
}
  `

  const ts = `
const adminUserIDs
   <span class='highlight'>: readonly number[]</span> = [1, 23, 88]

function isAdmin(userID<span class='highlight'>: number</span>) {
  for (let index = 0; index < adminUserIDs.length; index++) {
    if (<span class='underline-error'>adminUserIDs[index]</span> = userID) {
      return true
    };
  }
  return false
}  
`

  return (
    <div>
      <Editor title="Without TypeScript" isJS code={js} />
      <Editor title="TypeScript" front code={ts}
        line={() => <div className="line-error" style={{ top: "124px" }} />}
        inline={() =>
          (<>
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
            {props.inline && props.inline() || null}
          </div>
        </div>
        {props.line && props.line() || null}
      </div>
    </div>
  )
}

        // <div dangerouslySetInnerHTML={{ __html: props.code.trim() }} />
