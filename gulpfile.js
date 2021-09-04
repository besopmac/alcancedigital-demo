const gulp = require('gulp');
const cssnano = require('cssnano');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const postcss = require('gulp-postcss');
const imagemin = require('gulp-imagemin');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass')(require('sass'));
const browsersync = require('browser-sync').create();
const { src, series, parallel, dest, watch } = require('gulp');

function imageTask() {
  return src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'));
}

function jsTask() {
  return src('src/assets/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('main.js'))
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/assets/js'));
}

function scssTask() {
  return src('src/assets/scss/styles.scss', { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest('dist/assets/css', { sourcemaps: '.' }));
}

// Browsersync Tasks
function browsersyncServe(cb){
  browsersync.init({
    server: {
      baseDir: '.'
    }
  });
  cb();
}

function browsersyncReload(cb){
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask(){
  watch('src/*.html', browsersyncReload);
  watch(['src/assets/scss/**/*.scss', 'src/assets/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// Gulp Default
exports.default = series(parallel(imageTask, jsTask, scssTask, browsersyncServe), watchTask);