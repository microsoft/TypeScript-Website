// @errors: 2339
type NetworkLoadingState = {
  state: 'loading'
}

type NetworkFailedState = {
  state: 'failed'
  code: number
}

type NetworkSuccessState = {
  state: 'success'
  response: {
    title: string
    duration: number
    summary: string
  }
}
// ---cut---
type NetworkState = NetworkLoadingState | NetworkFailedState | NetworkSuccessState

function networkStatus(state: NetworkState): string {
  // Right now we don't know  which of the three potential
  // types state could be.

  // Trying to access a property which isn't shared
  // across all types will raise an error
  state.code

  // By switching on state, we can discriminate the
  switch (state.state) {
    case 'loading':
      return 'Downloading...'
    case 'failed':
      return `Error ${state.code} downloading`
    case 'success':
      return `Error ${state.response} downloading`
  }
}
