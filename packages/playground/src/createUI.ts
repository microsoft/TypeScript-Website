export interface UI {
  showModal: (message: string, subtitle?: string, buttons?: any) => void
}

export const createUI = (): UI => {
  return {
    showModal: () => undefined,
  }
}
