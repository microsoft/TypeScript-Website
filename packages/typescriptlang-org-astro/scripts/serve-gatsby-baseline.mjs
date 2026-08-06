import http from "node:http"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../typescriptlang-org/public")
const port = Number(process.env.PORT || 9000)
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "application/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".svg": "image/svg+xml", ".woff": "font/woff", ".woff2": "font/woff2" }

if (!fs.existsSync(path.join(root, "index.html"))) throw new Error(`Retained Gatsby production output is unavailable at ${root}`)

http.createServer((request, response) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(`http://127.0.0.1${request.url || "/"}`).pathname)
  } catch {
    response.writeHead(400, { "content-type": "text/plain; charset=utf-8" })
    response.end("Malformed URL")
    return
  }
  const relative = pathname.replace(/^\/+/, "")
  const candidates = [path.join(root, relative), path.join(root, relative, "index.html"), path.join(root, `${relative}.html`)]
  let file = candidates.find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile())
  let status = 200
  if (!file) {
    file = path.join(root, "404.html")
    status = 404
    if (!fs.existsSync(file)) {
      response.writeHead(status, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" })
      response.end("<!doctype html><html lang=\"en\"><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Not found</title></head><body><main><h1>Not found</h1><p>The retained Gatsby output did not emit a 404 artifact.</p><a href=\"/\">Home</a></main></body></html>")
      return
    }
  }
  try {
    const body = fs.readFileSync(file)
    response.writeHead(status, { "content-type": types[path.extname(file).toLowerCase()] || "application/octet-stream", "cache-control": "no-store" })
    response.end(body)
  } catch (error) {
    response.writeHead(404, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" })
    response.end("<!doctype html><html lang=\"en\"><head><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>Not found</title></head><body><main><h1>Not found</h1><p>The retained Gatsby output did not emit this artifact.</p><a href=\"/\">Home</a></main></body></html>")
  }
}).listen(port, "127.0.0.1", () => console.log(`Retained Gatsby baseline: http://127.0.0.1:${port}`))
