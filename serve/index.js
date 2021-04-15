const handler = require("serve-handler")
const http = require("http")

const server = http.createServer((request, response) => {
  // You pass two more arguments for config and middleware
  // More details here: https://github.com/zeit/serve-handler#options
  return handler(request, response, { public: "public" })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log("Running at http://localhost:" + port)
})
