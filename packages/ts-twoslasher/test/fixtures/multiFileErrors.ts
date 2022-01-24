// @filename: sum.ts
export function sum(a: number, b: number): number {
  return a + b
}

// @filename: ok.ts
import { sum } from "./sum"
sum(1, 2)

// @filename: error.ts
// @errors: 2345
import { sum } from "./sum"
sum(4, "woops")
