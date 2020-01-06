---
display: "JSX"
oneline: "Control how JSX is emitted"
---

Controls how JSX constructs are emitted in JavaScript files.
This only affects output of JS files that started in `.tsx` files.

- `preserve`: Emit `.jsx` files with the JSX unchanged
- `react`: Emit `.js` files with JSX changed to the equivalent `React.createElement` calls
- `react-native`: Emit `.js` files with the JSX unchanged
