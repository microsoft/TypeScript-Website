const remark = require('remark')
import gatsbyRemarkShiki from '../src/index'
import { join } from 'path'
const gatsbyTwoSlash = require('gatsby-remark-twoslasher-code-blocks')

const getMarkdownASTForCode = async (code: string, settings?: any) => {
  const markdownAST = remark().parse(code)
  gatsbyTwoSlash({ markdownAST })
  await gatsbyRemarkShiki({ markdownAST }, settings)
  return markdownAST
}

it('', () => {})

// describe('with a simple example', () => {
//   const file = `
// hello world

// \`\`\`ts twoslash
// // Hello
// const a = "123"
// const b = "345"
// \`\`\`

// OK world
// `

//   it('has all the right metadata set up', async () => {
//     const markdownAST = await getMarkdownASTForCode(file)
//     const code = markdownAST.children[1]

//     // Comes from remark
//     expect(code.lang).toEqual('ts')
//     expect(code.meta).toEqual('twoslash')

//     // Comes from ts-twoslash
//     expect(code.twoslash.extension).toEqual('ts')
//     expect(code.twoslash.staticQuickInfos).toHaveLength(2)
//   })

//   it('shows the right LSP results', async () => {
//     const markdownAST = await getMarkdownASTForCode(file)
//     const code = markdownAST.children[1]

//     expect(code.value).toContain(`data-lsp`)
//     expect(code.value).toContain(`<data-lsp lsp='const a:`)
//     expect(code.value).toContain(`<data-lsp lsp='const b:`)
//   })
// })

// describe('with a more complex example', () => {
//   const file = `
// ### This will error

// \`\`\`ts twoslash
// // @errors: 2345
// function longest<T extends { length: number }>(a: T, b: T) {
//   if (a.length >= b.length) {
//     return a;
//   } else {
//     return b;
//   }
// }

// // longerArray is of type 'number[]'
// const longerArray = longest([1, 2], [1, 2, 3]);
// // longerString is of type 'string'
// const longerString = longest("alice", "bob");
// // Error! Numbers don't have a 'length' property
// const notOK = longest(10, 100);

// const hello = longest("alice", "bob");
// console.log(hello);

// \`\`\`

// OK world
// `

//   it('shows the right LSP results', async () => {
//     const markdownAST = await getMarkdownASTForCode(file)
//     const code = markdownAST.children[1]

//     expect(code.twoslash.extension).toEqual('ts')
//     expect(code.twoslash.staticQuickInfos.length).toBeGreaterThan(1)

//     expect(code.value).toContain(`data-lsp`)
//     expect(code.value).toContain(`<data-lsp lsp='function longest`)

//     expect(code.twoslash.staticQuickInfos.length).toEqual(code.value.split('<data-lsp').length - 1)

//     // Error message
//     expect(code.value).toContain(`span class="error"`)
//     expect(code.value).toContain(`span class="error-behind"`)
//     // The error code
//     expect(code.value).toContain(`<span class="code">2345</span>`)
//   })

//   it('shows the right LSP results when a theme doesnt have unique tokens for identifiers', async () => {
//     const markdownAST = await getMarkdownASTForCode(file, { theme: 'light_vs' })
//     const code = markdownAST.children[1]

//     expect(code.value).toContain(`<data-lsp lsp='function longest`)

//     // Error message
//     expect(code.value).toContain(`span class="error"`)
//     expect(code.value).toContain(`span class="error-behind"`)
//     // The error code
//     expect(code.value).toContain(`<span class="code">2345</span>`)
//   })
// })

// describe('raw LSP details example', () => {
//   const file = `
// ### This will error

// \`\`\`ts twoslash
// // @errors: 2345
// function longest<T extends { length: number }>(a: T, b: T) {
//   if (a.length >= b.length) {
//     return a;
//   } else {
//     return b;
//   }
// }

// // longerArray is of type 'number[]'
// const longerArray = longest([1, 2], [1, 2, 3]);
// // longerString is of type 'string'
// const longerString = longest("alice", "bob");
// // Error! Numbers don't have a 'length' property
// const notOK = longest(10, 100);

// const hello = longest("alice", "bob");
// console.log(hello);
// \`\`\`

// OK world
// `

//   it('shows the right LSP results when a theme doesnt have unique tokens for identifiers', async () => {
//     const markdownAST = await getMarkdownASTForCode(file, { theme: 'light_vs' })
//     const code = markdownAST.children[1]

//     expect(code.value).toContain(`data-lsp`)
//     expect(code.value).toContain(`<data-lsp lsp='function longest`)

//     expect(code.value.split('<data-lsp').length).toEqual(code.twoslash.staticQuickInfos.length + 1)
//   })

//   it('shows the right LSP results with the typescript site theme', async () => {
//     const markdownAST = await getMarkdownASTForCode(file, {
//       theme: join(__dirname, '..', '..', 'typescriptlang-org', ' lib', ' themes', ' typescript-beta-light.json'),
//     })
//     const code = markdownAST.children[1]

//     expect(code.value).toContain(`data-lsp`)
//     expect(code.value).toContain(`<data-lsp lsp='function longest`)
//     expect(code.value.split('<data-lsp').length).toEqual(code.twoslash.staticQuickInfos.length + 1)
//   })
// })

// describe('no twoslash', () => {
//   const file = `
// ### This should not get twoslashd

// \`\`\`js
// function longest() {

// }
// \`\`\`

// OK world
// `

//   it('looks about right', async () => {
//     const markdownAST = await getMarkdownASTForCode(file, { theme: 'light_vs' })
//     const code = markdownAST.children[1]
//     expect(code.value).not.toContain('twoslash')
//   })
// })
