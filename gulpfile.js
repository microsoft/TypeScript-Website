// @ts-check
// Generated on 2015-05-16 using generator-jekyllized 0.7.3
"use strict";

const ghPages = require("gh-pages");
const path = require("path");

const gulp = require("gulp");
const shell = require("gulp-shell");
const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const size = require("gulp-size");
const imagemin = require("gulp-imagemin");
const changed = require("gulp-changed");
const useref = require("gulp-useref");
const gulpIf = require("gulp-if");
const revAll = require("gulp-rev-all");
const revReplace = require("gulp-rev-replace");
const uglify = require("gulp-uglify");
const minifyCss = require("gulp-minify-css");
const htmlmin = require("gulp-htmlmin");
const jshint = require("gulp-jshint")

// "del" is used to clean out directories and such
const del = require("del");

// Used to grab the filename of the docs to use in the doc headers
const tap = require('gulp-tap');
// BrowserSync isn"t a gulp package, and needs to be loaded manually
const browserSync = require("browser-sync");

// TypeScript compiler
const tsc = require("gulp-typescript");

// Need a command for reloading webpages using BrowserSync
const reload = browserSync.reload;

// Deletes the directory that is used to serve the site during development
gulp.task("clean:dev", del.bind(null, ["serve"]));

// Deletes the directory that the optimized site is output to
gulp.task("clean:prod", del.bind(null, ["site"]));

//Deletes both directories above...
gulp.task("clean", function (cb) {
  del(["serve","site"], cb);
});

gulp.task("docs", function () {
  const endrawLiquidTag = Buffer.from("\n\n{% endraw %}");
  gulp.src(["./TypeScript-Handbook/pages/**/*.md"], { base: "./TypeScript-Handbook/pages" })
    .pipe(tap(function (file) {
      const relativeFilePath = path.relative(path.join(file.cwd, file.base), file.path).replace(/\\/g, "/");
      let directoryName = relativeFilePath.substring(0, relativeFilePath.lastIndexOf("/"));
      if (directoryName === "tutorials") {
        // tutorials were published to the root directory, so to avoid breaking links for published files
        // treat this folder as if it is on the root.
        directoryName = "";
      }
      const baseFileName = path.basename(relativeFilePath, ".md");
      const relativeFileName = (directoryName ? directoryName + "/" : "") + baseFileName;

      const outputFileName = relativeFileName.toLowerCase().replace(/\s+|\.|'/g, "-") + ".html";
      const preamble = [
        "---",
        "title: " + baseFileName,
        "layout: docs",
        "permalink: /docs/handbook/" + outputFileName,
        "---",
        "{% raw %}"
      ].join("\n");

      file.contents = Buffer.concat([
        Buffer.from(preamble),
        file.contents,
        endrawLiquidTag
      ]);
    }))
    .pipe(gulp.dest("./src/_docs/handbook"));
});

// gulp.task("handbook-templates", function () {
//   return gulp.src("TypeScript-Handbook/pages/declaration files/templates/**")
//     .pipe(gulp.dest("./src/_docs/handbook/templates"));
// });


// Runs the build command for Jekyll to compile the site locally
// This will build the site with the production settings
gulp.task("jekyll:dev", shell.task("bundle exec jekyll build -I"));
gulp.task("jekyll-rebuild", ["jekyll:dev"], function () {
  reload;
});

// Almost identical to the above task, but instead we load in the build configuration
// that overwrites some of the settings in the regular configuration so that you
// don"t end up publishing your drafts or future posts
gulp.task("jekyll:prod", ["docs"], shell.task("bundle exec jekyll build --config _config.yml,_config.build.yml"));

// Compiles the SASS files and moves them into the "assets/stylesheets" directory
gulp.task("styles", function () {
  // Looks at the style.scss file for what to include and creates a style.css file
  return gulp.src("src/assets/scss/style.scss")
    .pipe(sass())
    // AutoPrefix your CSS so it works between browsers
    .pipe(autoprefixer("last 1 version", { cascade: true }))
    // Directory your CSS file goes to
    .pipe(gulp.dest("src/assets/stylesheets/"))
    .pipe(gulp.dest("serve/assets/stylesheets/"))
    // Outputs the size of the CSS file
    .pipe(size({title: "styles"}))
    // Injects the CSS changes to your browser since Jekyll doesn"t rebuild the CSS
    .pipe(reload({stream: true}));
});

// Updates the file: src/_data/urls.json
gulp.task("automate:download_urls", shell.task("node scripts/updateURLs.js"));

gulp.task("automate:download_search_assets", shell.task("node scripts/downloadSearchAssets.js"));

gulp.task("handbook-images", function() {
  return gulp.src("./TypeScript-Handbook/assets/images/**")
    .pipe(changed("site/assets/images"))
    .pipe(imagemin({
      // Lossless conversion to progressive JPGs
      progressive: true,
      // Interlace GIFs for progressive rendering
      interlaced: true
    }))
    .pipe(gulp.dest("site/assets/images"))
    .pipe(size({title: "images"}));
});

// Optimizes the images that exists
gulp.task("images", function () {
  return gulp.src("src/assets/images/**")
    .pipe(changed("site/assets/images"))
    .pipe(imagemin({
      // Lossless conversion to progressive JPGs
      progressive: true,
      // Interlace GIFs for progressive rendering
      interlaced: true
    }))
    .pipe(gulp.dest("site/assets/images"))
    .pipe(size({title: "images"}));
});

// Copy over fonts to the "site" directory
gulp.task("fonts", function () {
  return gulp.src("src/assets/fonts/**")
    .pipe(gulp.dest("site/assets/fonts"))
    .pipe(size({ title: "fonts" }));
});

// Copy over scripts ignored when minifing...
gulp.task("scripts", ["sample-script", "playground", "examples"], function () {
  // Better hope nothing is wrong.
});

// Copy over the sample scripts to the "site" directory
// gulp.task("examples", function () {
//   return gulp.src("src/examples/*.ts")
//      .pipe(gulp.dest("site/examples/"))
//      .pipe(size({ title: "examples" }));
// });

// Copy over the sample scripts to the "site" directory
gulp.task("sample-script", function () {
  return gulp.src("src/samples/*.js")
     .pipe(gulp.dest("site/samples/"))
     .pipe(size({ title: "sample-script" }));
});

// Copy over the playground scripts to the "site" directory
gulp.task("playground", function () {
  return gulp.src("src/play/public/**/*")
     .pipe(gulp.dest("site/play"))
     .pipe(size({ title: "playground" }));
});

gulp.task("playground:dev", function () {
  return gulp.src("src/play/public/**/*")
     .pipe(gulp.dest("serve/play"))
     .pipe(size({ title: "playground" }));
});


// Copy CNANE file to the "site" directory
gulp.task("cname", function() {
  return gulp.src("src/CNAME")
    .pipe(gulp.dest("site"));
});

// Copy web.config file to the "site" directory
gulp.task("webconfig", function() {
  return gulp.src("src/Web.config")
    .pipe(gulp.dest("site"));
});

// Copy xml and txt files to the "site" directory
gulp.task("copy", function () {
  return gulp.src(["serve/*.txt", "serve/*.xml"])
    .pipe(gulp.dest("site"))
    .pipe(size({ title: "xml & txt" }))
});

// Optimizes all the CSS, HTML and concats the JS etc
gulp.task("html", ["styles"], function () {
  const assets = useref.assets({searchPath: "serve"});

  return gulp.src("serve/**/*.html")
    .pipe(assets)
    // Concatenate JavaScript files and preserve important comments
    .pipe(gulpIf("/\.js$/", uglify({ preserveComments: "some" })))
    //.pipe(gulpIf("*.js", uglify({preserveComments: "some"})))
    // Minify CSS
    .pipe(gulpIf("/\.css$/b", minifyCss()))
    //.pipe(gulpIf("*.css", minifyCss()))
    // Start cache busting the files
    .pipe(revAll({ ignore: [".eot", ".svg", ".ttf", ".woff",".png",".jpg"] }))
    .pipe(assets.restore())
    // Conctenate your files based on what you specified in _layout/header.html
    .pipe(useref())
    // Replace the asset names with their cache busted names
    .pipe(revReplace())
    // Minify HTML
    .pipe(gulpIf("/\.html$/b", htmlmin({
      removeComments: true,
      removeCommentsFromCDATA: true,
      removeCDATASectionsFromCDATA: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeRedundantAttributes: true
    })))
    // Send the output to the correct folder
    .pipe(gulp.dest("site"))
    .pipe(size({title: "optimizations"}));
});

gulp.task("deploy", function(cb) {
  const now = new Date();

  // Support deploying via a GitHub Actions token
  const isActions = process.env.GITHUB_TOKEN;

  const deployOptions = {
    repo: "https://github.com/Microsoft/TypeScript-Website.git",
    branch: "SITE-STAGING",
    message: `Update ${now.toISOString()}.`,
  };

  if (isActions) {
    deployOptions.repo = `https://${process.env.GITHUB_TOKEN}@github.com/Microsoft/TypeScript-Website.git`;
    deployOptions.user = {
      name: process.env.GITHUB_ACTOR,
      email: process.env.GITHUB_ACTOR + '@users.noreply.github.com'
    }
  }

  // Deploys your optimized site, you can change the settings in the html task if you want to
  ghPages.publish(path.join(process.cwd(), "site"), deployOptions, cb);
});

// Run JS Lint against your JS
gulp.task("jslint", function () {
  gulp.src("./serve/assets/javascript/*.js")
    // Checks your JS code quality against your .jshintrc file
    .pipe(jshint(".jshintrc"))
    .pipe(jshint.reporter());
});

// Runs "jekyll doctor" on your site to check for errors with your configuration
// and will check for URL errors a well
gulp.task("doctor", shell.task("jekyll doctor"));

// Runs the script to generate the TOC for the playground examples
gulp.task("examples", ["examples:toc"], function() {
    gulp.src(["Examples/**/*"]).pipe(gulp.dest("site/ex"))
    gulp.src(["Examples/**/*"]).pipe(gulp.dest("serve/ex"))
});

gulp.task("examples:toc", shell.task("node Examples/scripts/generateTOC.js"))

// BrowserSync will serve our site on a local server for us and other devices to use
// It will also auto-reload across all devices as well as keep the viewport synchronized
// between them.
gulp.task("serve:dev", ["docs", "styles", "jekyll:dev", "playground:dev", "examples"], function () {
  browserSync({
    notify: true,
    // tunnel: "",
    server: {
      baseDir: "serve"
    }
  });
});

// These tasks will look for files that change while serving and will auto-regenerate or
// reload the website accordingly. Update or add other files you need to be watched.
gulp.task("watch", function () {
  gulp.watch(["src/**/*.md", "src/**/*.html", "src/**/*.xml", "src/**/*.txt", "src/**/*.js", "!src/play/**/*"], ["jekyll-rebuild"]);
  gulp.watch(["serve/assets/stylesheets/*.css"], reload);
  gulp.watch(["src/assets/scss/**/*.scss"], ["styles"]);
  gulp.watch(["src/play/**/*"], ["playground:dev"]);
  gulp.watch(["Examples/**/*"], ["examples"]);
});

// Serve the site after optimizations to see that everything looks fine
gulp.task("serve:prod", function () {
  browserSync({
    notify: false,
    // tunnel: true,
    server: {
      baseDir: "site"
    }
  });
});

// Default task, run when just writing "gulp" in the terminal
gulp.task("default", ["serve:dev", "watch"]);

// Checks your CSS, JS and Jekyll for errors
gulp.task("check", ["jslint", "doctor"], function () {
  // Better hope nothing is wrong.
});

// Builds the site but doesn't serve it to you
gulp.task("build", ["jekyll:prod", "styles", "examples"], function () {});

// Builds your site with the "build" command and then runs all the optimizations on
// it and outputs it to "./site"
gulp.task("publish", function () {
  gulp.start("automate:download_urls", "automate:download_search_assets", "build", "html", "copy", "images", "handbook-images", "fonts", "scripts", "cname", "webconfig", "playground");
});
