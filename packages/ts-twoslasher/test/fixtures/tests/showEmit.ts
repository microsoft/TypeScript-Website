// @experimentalDecorators
// @showEmit
// @showEmittedFile: component.js

// @filename: service.ts
export class Service {}

// @filename: component.ts
import type { Service } from "./service"

declare var decorator: any

@decorator
class MyComponent {
  constructor(public Service: Service) {}

  @decorator
  method(x: this) {}
}
