const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const sass = require('gulp-sass')(require('sass'));
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const del = require("del");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const csso = require("postcss-csso");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const mode = require("gulp-mode")();
const processhtml = require('gulp-processhtml');

const folder = mode.production() ? "build" : "source";

// Styles

const styles = () => {
  return gulp.src("source/sass/style.scss")
    .pipe(plumber()) //errors
    .pipe(mode.development(sourcemap.init()))
    .pipe(sass())
    .pipe(mode.production((postcss([
      autoprefixer(),
      csso() //min css
    ]))))
    .pipe(mode.production(rename("style.min.css")))
    .pipe(mode.development(sourcemap.write(".")))
    .pipe(gulp.dest(`${folder}/css`))
    .pipe(sync.stream());
}

exports.styles = styles;


// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: folder
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

exports.server = server;

// Reload

const reload = (done) => {
  sync.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles));
  gulp.watch("source/js/scripts.js", gulp.series(scripts));
  gulp.watch("source/*.html", gulp.series(html, reload));
}

// HTML

const html = () => {
  return gulp.src("source/*.html")
    .pipe(processhtml())
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

exports.html = html;

// Images

const optimizeImages = () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"))
}

exports.optimizeImages = optimizeImages;

// Webp

// const makeWebp = () => {
//   return gulp.src("source/img/**/*.{png,jpg}")
//     .pipe(webp({quality: 90}))
//     .pipe(gulp.dest("source/img"))
// }

// exports.webp = makeWebp;

const copyImages = async () => {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
    .pipe(gulp.dest("build/img"))
}

exports.copyImages = copyImages;

// Sprite

// const sprite = () => {
//   return gulp.src("source/img/**/icon-*.svg")
//       .pipe(svgstore())
//       .pipe(rename("sprite.svg"))
//       .pipe(gulp.dest("build/img")) //source
// }

// exports.sprite = sprite;

// Scripts

const scripts = () => {
  return gulp.src("source/js/scripts.js")
    .pipe(terser())
    .pipe(rename("scripts.min.js"))
    .pipe(gulp.dest("build/js"))
    .pipe(sync.stream());
}

exports.scripts = scripts;

// Copy

const copy = async () => {
  gulp.src([
    "source/*.ico",
    "source/*.webmanifest",
    "source/fonts/*.{woff2,woff}"
  ], {
    base: "source",
    allowEmpty: true
  })
    .pipe(gulp.dest("build"))
}

exports.copy = copy;

// Clean

const clean = () => {
  return del("build");
}

exports.clean = clean;

// Build

const build = gulp.series(
  clean,
  copy,
  copyImages,
  optimizeImages,
  gulp.parallel (
    styles,
    html,
    scripts
  ),
  gulp.series(
    server,
    watcher
  )
)

exports.build = build;

// Default

exports.default = gulp.series(
  styles,
  gulp.series(
    server,
    watcher
  )
)
