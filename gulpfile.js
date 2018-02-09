"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var imagemin = require("gulp-imagemin");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var inline = require("gulp-inline-css");
var server = require("browser-sync").create();
var run = require("run-sequence");
var del = require("del");

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**/*.js"
  ], {
    base: "."
  })
    .pipe(gulp.dest("build"));
});

gulp.task("style", function() {
  return gulp.src("sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("css"))
    .pipe(server.stream());
});

gulp.task("html", function () {
  return gulp.src("*.html")
    .pipe(inline())
    .pipe(gulp.dest("build"))
    .pipe(server.stream());
});

gulp.task("images", function() {
  return gulp.src("build/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/img"));
});

gulp.task("serve", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("*.html", ["html"]);
  gulp.watch("css/*.css", ["html"]);
});

gulp.task("build", function(done) {
  run(
    "clean",
    "copy",
    "images",
    "style",
    "html",
    done
  );
});
