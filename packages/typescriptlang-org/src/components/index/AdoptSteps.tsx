import React from "react"
import {Code as Index1} from "./twoslash/generated/IndexGetStarted1.js"
import {Code as Index2} from "./twoslash/generated/IndexGetStarted2.js"
import {Code as Index3} from "./twoslash/generated/IndexGetStarted3.js"
import {Code as Index4} from "./twoslash/generated/IndexGetStarted4"

type StepProps = {
    i: (str: any) => string
}

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
            <Index1 />
            <p>JavaScript File</p>
            <Stepper index={0} />
        </div>
    )
}

export const StepTwo = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <Index2 />
            <p>JavaScript with TS Check</p>
            <Stepper index={1} />
        </div>
    )
}

export const StepThree = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <Index3 />
            <p>JavaScript with JSDoc</p>
            <Stepper index={2} />
        </div>
    )
}

export const StepFour = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <Index4 />
            <p>TypeScript File</p>
            <Stepper index={3} />
        </div>
    )
}