## TypeScript Website

This a pretty traditional Gatsby site. You can start it up via:

```sh
yarn start
```

Which starts up a dev server. 

### Visual Regression Testing

Right now one of the main ways in which the site is tested is via visual regression testing using
[BackstopJS](https://github.com/garris/BackstopJS). Currently this is directly tied to Orta's computers 
and set-up so it isn't feasible for others to run them.

To run them from this folder:

```sh
# install globally
# npm install -g backstopjs

# To run the tests
backstop test

# To agree to changes
backstop approve
```
