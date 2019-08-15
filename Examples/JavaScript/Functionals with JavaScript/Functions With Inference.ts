
// () => () => ""

// arr.map(myCustomFunc)



// Allowing weaker typing via index signatures

type AnyObjectButMustHaveName = { 
  name: string; 
  [key: string]: any; 
}

const printFormattedName = (input: AnyObjectButMustHaveName) => { }

printFormattedName({name: "joey"})
printFormattedName({name: "joey", age: 23})


// function overloads

// move to generics
