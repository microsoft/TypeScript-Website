// twoslash: { themes: ["min-dark", "../../../packages/typescriptlang-org/lib/themes/typescript-beta-dark"] }
/** one **/
declare function getUser(id: number): User
/** two **/
declare function saveUser(id: number, user: User): User
// ---cut---
interface User {
  id: number
  firstName: string
  lastName: string
  role: string
}

function updateUser(id: number, update: Partial<User>) {
  const user = getUser(id)
  const newUser = { ...user, ...update }
  saveUser(id, newUser)
}
