### Testing

There are two types of tests:

- Units which are Jest tests, and not unique to this project

- Integration tests where you place a fixture code sample in the right folder and get a response JSON result. There are three folders for tests:
  - `test/fixtures` - Any test in this file is shown in the README, so they should showcase features - not bugs
  - `tests/fixtures/throws` - A test which should correctly raise
  - `tests/fixtures/tests` - All other tests, repros etc
