//// { "compiler": { "ts": "4.3.4" } }
// TypeScript's type system aims to provide type tools
// which match existing JavaScript code, and one of the
// features which comes natural to JavaScript code is
// to support many different types inputs for a value,
// but to only provide one set output.

// With TS 4.3, you can now have different set types
// vs the get for a particular property with getters
// and setters.

// For example, this timer accepts many possible types
// when setting the start property, but will only give
// a Date object back.

class Timer {
  #start = new Date();

  get start(): Date {
    return this.#start;
  }

  set start(value: string | number | Date | undefined) {
    if (!value) this.#start = new Date();
    else if (value instanceof Date) this.#start = value;
    else this.#start = new Date(value);
  }
}

const timer = new Timer();

timer.start = "2021-06-28T14";
console.log(timer.start);

timer.start = 1624890417925;
console.log(timer.start);

timer.start = new Date();
console.log(timer.start);
