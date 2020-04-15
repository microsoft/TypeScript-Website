import * as React from "react"
import { GreyButton } from "./GreyButton"

type ButtonProps = Omit<import("./GreyButton").Props, "headline">
export type GridProps = {
  buttons: ButtonProps[]
  headline?: true
}


/** A pretty grid of grey buttons */
export const ButtonGrid = (props: GridProps) => (
  <div className="flow-links">
    {props.buttons.map(b =>
      <GreyButton {...b} headline={props.headline} key={b.href} />
    )}
  </div>
)
