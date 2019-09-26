// A discriminated type union is where you use code flow
// analysis to reduce a set of potential objects down to one
// specific object.
//
// This pattern works really well for sets of similar
// objects with a different string or number constant
// for example: a list of named events, or versioned
// sets of objects.

type TimingEvent = { name: "start"; userStarted: boolean }
                 | { name: "closed"; duration: number };

// When event comes into this function, it could be any
// of the two potential types.

const handleEvent = (event: TimingEvent) => {
  // By using a switch against event.name TypeScript's code
  // flow analysis can determine that an object can only
  // be represented by one type in the union.

  switch (event.name) {
    case "start":
      // This means you can safely access userStarted
      // because it's the only type inside TimingEvent
      // where name is "start"
      const initiatedByUser = event.userStarted;
      break;

    case "closed":
      const timespan = event.duration;
      break;
  }
};

// This pattern is the same with numbers which we can use
// version as the discriminate for.

// In this example, we have a discriminate union and an
// additional error state to handle.

type APIResponses = { version: 0; msg: string }
                  | { version: 1; message: string; status: number }
                  | { error: string };

const handleResponse = (response: APIResponses) => {
  // Handle the error case, and then return
  if ("error" in response) {
    console.error(response.error);
    return;
  }

  // TypeScript now knows that APIResponse cannot be
  // the error type. If it were the error, the function
  // would have returned. You can verify this by
  // hovering over response below.

  if (response.version === 0) {
    console.log(response.msg);
  } else if (response.version === 1) {
    console.log(response.status, response.message);
  }
};

// You're better off using a switch statement instead of
// if statements because you can make assurances that all
// parts of the union are checked. There is a good pattern
// for this using the never type in the handbook

// https://www.typescriptlang.org/docs/handbook/advanced-types.html#discriminated-unions
