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

export const StepperAll = () => {
    return <div id="global-stepper" className="adopt-step-stepper">
        <div className="first yellow"></div>
        <div className="yellow-hint-blue"></div>
        <div className="yellow-lot-blue"></div>
        <div className="blue"></div>
    </div>
}


export const StepOne = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <div className="adopt-step-content">
                <Index1 />
                <p>{props.i("index_2_migrate_1")}</p>
                <Stepper index={0} />
            </div>
        </div>
    )
}

export const StepTwo = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <div className="adopt-step-content">
                <Index2 />
                <p>{props.i("index_2_migrate_2")}</p>
                <Stepper index={1} />
            </div>
        </div>
    )
}

export const StepThree = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <div className="adopt-step-content">
                <Index3 />
                <p>{props.i("index_2_migrate_3")}</p>
                <Stepper index={2} />
            </div>
        </div>
    )
}

export const StepFour = (props: StepProps) => {
    return (
        <div className="adopt-step">
            <div className="adopt-step-content">
                <Index4 />
                <p>{props.i("index_2_migrate_4")}</p>
                <Stepper index={3} />
            </div>
        </div>
    )
}