module.exports = {
  hooks: {
    readPackage(pkg) {
      if (pkg.name === "@vscode/monaco-lsp-client") {
        delete pkg.peerDependencies?.["monaco-editor-core"]
      }
      return pkg
    },
  },
}
