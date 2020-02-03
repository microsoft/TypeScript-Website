const customPlugin: import('./vendor/playground').PlaygroundPlugin = {
  id: 'present',
  displayName: 'Present',
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
  didUnmount: () => {
    console.log('Removing plugin')
  },
}

export default customPlugin
