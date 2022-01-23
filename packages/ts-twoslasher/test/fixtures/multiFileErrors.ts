// @filename: sum.ts
export function sum(a: number, b: number): number {
  return a + b;
}

// @filename: main.ts
// @errors: 2345
import { sum } from "./sum";
sum(4, "woops");
