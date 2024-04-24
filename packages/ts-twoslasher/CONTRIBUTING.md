### How to make a change in Twoslash

It's likely you have a failing twoslash test case, copy that into `test/fixtures/tests/[name].ts` and run

> `yarn workspace @typescript/twoslash test`

This will create a Jest snapshot of that test run which you can use as an integration test to ensure your change doesn't get regressed.

### Other complex code

It's a normal Jest project where you can also make unit tests like `test/cutting.test.ts`.
