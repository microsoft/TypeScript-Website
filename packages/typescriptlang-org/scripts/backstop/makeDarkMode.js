module.exports = async (page, scenario) => {
  console.log("SWITCHING TO DARK for " + scenario.label)

  await page.emulateMediaFeatures([
    {
      name: "prefers-color-scheme",
      value: "dark",
    },
  ])
  // await wait()
}
