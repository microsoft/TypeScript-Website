export const setEditorTheme = (theme: 'light' | 'dark' | 'hc', editor: typeof import('monaco-editor').editor) => {
  const newTheme = theme ? theme : localStorage ? localStorage.getItem('editor-theme') || 'light' : 'light'

  editor.setTheme(newTheme)

  document
    .querySelectorAll('a[id^=theme-]')
    .forEach(anchor =>
      anchor.id === `theme-${newTheme}`
        ? anchor.classList.add('current-theme')
        : anchor.classList.remove('current-theme')
    )

  localStorage.setItem('editor-theme', newTheme)

  // Sets the theme on the body so CSS can change between themes
  document.body.classList.remove('light', 'dark', 'hc')

  // So dark and dark-hc can share CSS
  if (newTheme === 'dark-hc') {
    document.body.classList.add('dark')
    document.body.classList.add('hc')
  } else {
    document.body.classList.add(newTheme)
  }
}
