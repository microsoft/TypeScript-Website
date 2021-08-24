interface Account {
  id: number
  displayName: string
  version: 1
}

function welcome(user: Account) {
  console.log(user.id)
}