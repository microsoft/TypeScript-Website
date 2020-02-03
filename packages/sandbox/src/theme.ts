const blue = '3771EF'
const darkerBlue = '1142AF'

const grey = '84864d'
const greenDark = '10990D'
const greenLight = '54F351'

export const sandboxTheme: import('monaco-editor').editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: '', foreground: '000000', background: 'fffffe' },
    { token: 'invalid', foreground: 'cd3131' },
    { token: 'emphasis', fontStyle: 'italic' },
    { token: 'strong', fontStyle: 'bold' },

    { token: 'variable', foreground: '11bb11' },
    { token: 'variable.predefined', foreground: '4864AA' },
    { token: 'constant', foreground: '44ee11' },
    { token: 'comment', foreground: grey },
    { token: 'number', foreground: greenDark },
    { token: 'number.hex', foreground: '3030c0' },
    { token: 'regexp', foreground: greenLight },
    { token: 'annotation', foreground: '808080' },
    { token: 'type', foreground: darkerBlue },

    { token: 'delimiter', foreground: '000000' },
    { token: 'delimiter.html', foreground: '383838' },
    { token: 'delimiter.xml', foreground: '0000FF' },

    { token: 'tag', foreground: '800000' },
    { token: 'tag.id.pug', foreground: '4F76AC' },
    { token: 'tag.class.pug', foreground: '4F76AC' },
    { token: 'meta.scss', foreground: '800000' },
    { token: 'metatag', foreground: 'e00000' },
    { token: 'metatag.content.html', foreground: 'FF0000' },
    { token: 'metatag.html', foreground: '808080' },
    { token: 'metatag.xml', foreground: '808080' },
    { token: 'metatag.php', fontStyle: 'bold' },

    { token: 'key', foreground: '863B00' },
    { token: 'string.key.json', foreground: 'A31515' },
    { token: 'string.value.json', foreground: '0451A5' },

    { token: 'attribute.name', foreground: 'FFFF00' },
    { token: 'attribute.value', foreground: '0451A5' },
    { token: 'attribute.value.number', foreground: '09885A' },
    { token: 'attribute.value.unit', foreground: '09885A' },
    { token: 'attribute.value.html', foreground: '0000FF' },
    { token: 'attribute.value.xml', foreground: '0000FF' },

    { token: 'string', foreground: greenDark },

    { token: 'keyword', foreground: blue },
    { token: 'keyword.json', foreground: '0451A5' },
  ],
  colors: {
    editorBackground: '#F6F6F6',
    editorForeground: '#000000',
    editorInactiveSelection: '#E5EBF1',
    editorIndentGuides: '#D3D3D3',
    editorActiveIndentGuides: '#939393',
    editorSelectionHighlight: '#ADD6FF4D',
  },
}

export const sandboxThemeDark: import('monaco-editor').editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'constant', foreground: '44ee11' },
    { token: 'comment', foreground: grey },
    { token: 'number', foreground: greenDark },
    { token: 'regexp', foreground: greenLight },
    { token: 'type', foreground: blue },
  ],
  colors: {
    // 'editor.background': '#313131',
  },
}
