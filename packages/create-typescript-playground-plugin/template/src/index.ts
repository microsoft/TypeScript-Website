const customPlugin: import('./vendor/playground').PlaygroundPlugin = {
  id: 'my-plugin',
  displayName: 'New Plugin',

  // This is called synchronously when a your plugin is about to be
  // presented in a tab. Container is a blank div in the sidebar
  // for you to present data in.
  didMount: (sandbox, container) => {
    console.log('Showing new plugin')

    const p = document.createElement('p')
    p.textContent = 'Playground plugin defaults'
    container.appendChild(p)

    const startButton = document.createElement('input')
    startButton.type = 'button'
    startButton.value = 'Change the code in the editor'
    container.appendChild(startButton)

    startButton.onclick = () => {
      sandbox.setText('You clicked the button!')
    }
  },

  // This is called occasionally as text changes in monaco,
  // it does not directly map 1 keyup to once run of the function
  // because it is intentionally called at most once every 0.3 seconds
  // and then will always run at the end.
  modelChangedDebounce: async (sandbox, _model) => {
    //
  },

  // Gives you a chance to remove anything set up,
  // the container itself if wiped of children after this.
  didUnmount: () => {
    console.log('Removing plugin')
  },
}

export default customPlugin
