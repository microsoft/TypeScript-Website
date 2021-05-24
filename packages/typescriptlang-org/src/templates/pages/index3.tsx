import * as React from "react"

import { Intl } from "../../components/Intl"

import "../../templates/pages/index.scss"

const Index: React.FC<{}> = (props) => {

  return (
    <>
      <div style={{  background: "url(" + require("../../assets/v3.png").default + ")", backgroundPositionX:"center", height: "4600px"}}>
      </div>
    </>
  )
}


export default (props: {}) => <Intl locale="en"><Index {...props} /></Intl>

