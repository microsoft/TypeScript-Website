import React from "react"

type StepProps = {
    i: (str: any) => string
}

const one =`
function compact(arr) {
    if (orr.length > 10)
        return arr.trim(0, 10)
    return arr
}`.trim()

const two =`
// @ts-check

function compact(arr) {
  if (orr.length > 10)
    return arr.trim(0, 10)
  return arr
}`.trim()
    
const three =`
// @ts-check

/** @param {any[]} arr */
function compact(arr) {
  if (arr.length > 10)
    return arr.trim(0, 10)
  return arr
}`.trim()

const four = `
function compact(arr: string[]) {
    if (arr.length > 10)
      return arr.slice(0, 10)
    return arr
}`.trim()
    
const Stepper = (props: { index: number }) => {
    return <div className="adopt-step-stepper">
        <div className={"first" + (props.index === 0 ? " yellow" : "") }></div>
        <div className={props.index === 1 ? "yellow-hint-blue" : ""}></div>
        <div className={props.index === 2 ? "yellow-lot-blue" : ""}></div>
        <div className={props.index === 3 ? "blue" : ""}></div>
    </div>

}

export const StepOne = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <pre><code>{one}</code></pre>
            <p>JavaScript File</p>
            <Stepper index={0} />
        </div>
    )
}

export const StepTwo = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <pre><code>{one}</code></pre>
            <p>JavaScript with TS Check</p>
            <Stepper index={1} />
        </div>
    )
}

export const StepThree = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <pre><code>{one}</code></pre>
            <p>JavaScript with JSDoc</p>
            <Stepper index={2} />
        </div>
    )
}

export const StepFour = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <pre><code>{one}</code></pre>
            <p>TypeScript File</p>
            <Stepper index={3} />
        </div>
    )
}