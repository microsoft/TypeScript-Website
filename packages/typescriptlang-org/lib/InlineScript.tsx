
import React, { useEffect } from "react"

/** Render a script inline */
export const InlineScript = (props: {children: any}) => {
  // Run the child JS on the component mount
  useEffect(() =>eval(props.children))
  // Use the inline script 
  return <inlinescript>{props.children}</inlinescript>
}
