export const hasLocalStorage = (() => {
    try {
        return typeof localStorage !== `undefined`
    } catch {
        return false
    }
})();