//// { compiler: {  }, order: 1 }

// New to 3.7 is the ability to quickly convert
// a const variable to a let when the value
// has been re-assigned.

// You can try this by highlighting the below error
// and choosing to run the quick-fix.

const displayName = "Andrew";

displayName = "Andrea";
