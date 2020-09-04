import { useState } from "react"

export const useLocalStorage = <State extends string>(key: string, initialValue: State) => {
    const [value, setValue] = useState(globalThis.localStorage?.getItem(key) ?? initialValue)

    const setValueAndStorage = (newValue: State) => {
        setValue(newValue)
        globalThis.localStorage?.setItem(key, newValue)
    }

    return [value, setValueAndStorage] as const
}
