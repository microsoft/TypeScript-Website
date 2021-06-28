//// { compiler: { ts: "4.4.0-dev.20210628", useJavaScript: true, checkJS: false } }
// For JavaScript users, TypeScript powers most of the tooling
// for auto-complete and other IDE features like refactoring.

// During the process of running the TypeScript compiler over
// JavaScript files, TypeScript has typically _not_ raised errors
// in an editor unless the project is opted-in  via 'checkJS' or
// has // @check-ts comment.

// With 4.4, we are letting the TypeScript compiler raise errors
// when we have a very high confidence that the error is likely
// a typo.

const album = {
  name: "Afraid of Heights",
  author: {
    name: "Billy Talent",
    releaseDate: "2016",
  },
};

// In a previous version of the TypeScript tooling for JavaScript,
// this would not have raised an error, even though it has a very
// high confidence of being incorrect:
album.nme;

// For full details see:
// https://github.com/microsoft/TypeScript/commit/e53f19f8f235ed21f405017a1f8670e9329027ce
