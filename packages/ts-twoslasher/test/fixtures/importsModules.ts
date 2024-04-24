// @filename: Component.tsx
import React from "react"

export function Hello() {
  return (
    <div>
      <h1>Hello World</h1>
    </div>
  )
}

// @filename: index.ts
import { Hello } from "./Component"
console.log(Hello)
