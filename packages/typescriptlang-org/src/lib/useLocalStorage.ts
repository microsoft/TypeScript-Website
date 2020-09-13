import { useState } from "react"
import { hasLocalStorage } from "./hasLocalStorage"

export type UseLocalStorage = <State extends string>(key: string, initialValue: State) => readonly [
    State,
    (newState: State) => void
]

export const useLocalStorage: UseLocalStorage = hasLocalStorage
    ? <State extends string>(key, initialValue) => {
        const [value, setValue] = useState(localStorage.getItem(key) ?? initialValue)

        const setValueAndStorage = (newValue: State) => {
            setValue(newValue)
            localStorage.setItem(key, newValue)
        }

        return [value, setValueAndStorage] as const
    }
    : useState
