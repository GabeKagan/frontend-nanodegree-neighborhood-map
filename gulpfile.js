var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('scripts', function() {
    return gulp.src('js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('js/'))
    .pipe(uglify())
    .pipe(gulp.dest('js/'))
    .pipe(notify({message: 'Script tasks complete'}));
});