const blue = "3757ef"
const darkerBlue = "1142AF"

const grey = "6c6f2d"
const greenDark = "0c840a"
const green = "7caf3d" // dark mode comment color

export const sandboxTheme: import("monaco-editor").editor.IStandaloneThemeData = {
  base: "vs",
  inherit: true,
  rules: [
    { token: "", foreground: "000000", background: "fffffe" },
    { token: "invalid", foreground: "cd3131" },
    { token: "emphasis", fontStyle: "italic" },
    { token: "strong", fontStyle: "bold" },

    { token: "variable", foreground: "11bb11" },
    { token: "variable.predefined", foreground: "4864AA" },
    { token: "constant", foreground: "44ee11" },
    { token: "comment", foreground: grey },
    { token: "number", foreground: greenDark },
    { token: "number.hex", foreground: "3030c0" },
    { token: "regexp", foreground: "#811f3f" },
    { token: "annotation", foreground: "808080" },
    { token: "type", foreground: darkerBlue },

    { token: "delimiter", foreground: "000000" },
    { token: "delimiter.html", foreground: "383838" },
    { token: "delimiter.xml", foreground: "0000FF" },

    { token: "tag", foreground: "800000" },

    { token: "key", foreground: "863B00" },
    { token: "string.key.json", foreground: "A31515" },
    { token: "string.value.json", foreground: "0451A5" },

    { token: "string", foreground: greenDark },

    { token: "keyword", foreground: blue },
    { token: "keyword.json", foreground: "0451A5" },
  ],
  colors: {
    editorBackground: "#fafafa",
    editorForeground: "#000000",
    editorInactiveSelection: "#E5EBF1",
    editorIndentGuides: "#D3D3D3",
    editorActiveIndentGuides: "#939393",
    editorSelectionHighlight: "#ADD6FF4D",
  },
}

export const sandboxThemeDark: import("monaco-editor").editor.IStandaloneThemeData = {
  base: "vs-dark",
  inherit: true,
  rules: [
    { token: "constant", foreground: "44ee11" },
    { token: "comment", foreground: green },
    { token: "regexp", foreground: "#811f3f" },
  ],
  colors: {
    // 'editor.background': '#313131',
  },
}
