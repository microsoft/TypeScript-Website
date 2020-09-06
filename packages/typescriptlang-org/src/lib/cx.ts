export function cx(...args: (string | undefined | false)[]) {
    const classes: string[] = []
    for (const arg of args) {
        if (!arg) continue
        classes.push(arg)
    }
    return classes.join(" ")
}
