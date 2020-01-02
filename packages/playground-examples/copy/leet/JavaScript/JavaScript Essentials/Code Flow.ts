//// { title: 'c0d3 fl0w', order: 3, compiler: { strictNullChecks: true } }

// How c0de fl0ws inside our JavaScript files can affect
// the types throughout our programs.

const users = [{ name: 'Ahmed' }, { name: 'Gemma' }, { name: 'Jon' }]

// We're going to look to see if we can find a user named "jon".
const jon = users.find(u => u.name === 'jon')
