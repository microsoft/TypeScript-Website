const tasks = arr => arr.join(" && ")
const isOrta = process.env.USER && process.env.USER.includes("orta")

// Everyone else gets a NO-OP
module.exports = !isOrta
  ? {}
  : {
      hooks: {
        "pre-push": tasks([
          "yarn build-site",
          "afplay .vscode/done.aiff",
          "afplay .vscode/done.aiff",
          "afplay .vscode/done.aiff",
        ]),
      },
    }
