var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');
    sourcemaps = require('gulp-sourcemaps'),
    iconfont = require('gulp-iconfont'),
    iconfontCss = require('gulp-iconfont-css');
    fontName = 'icons';

var paths = {
 scripts: ['src/js/boostrap/bootstrap.js'],
 libs: ['src/js/boostrap/bootstrap.js'],
 html: ['src/pages/*.html'],
 icons: ['src/icons/'],
 fonts: ['src/fonts/**'],
 extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico']
};

gulp.task('iconfont', function(){
    gulp.src([ paths.icons + '*.svg'])
    .pipe(iconfontCss({
      fontName: fontName,
      targetPath: '../scss/_icons.scss',
      fontPath: '../fonts/'
    }))
    .pipe(iconfont({
      fontName: fontName
     }))
    .pipe(gulp.dest('src/fonts'));
});

gulp.task('styles', function() {
  return gulp.src('src/scss/main.scss', { style: 'expanded' })
  	.pipe(sass().on('error', sass.logError))
    .pipe(concat('style.css'))
    .pipe(autoprefixer('last 2 version'))
    .pipe(gulp.dest('dist/css'))
    .pipe(rename({suffix: '.min'}))
    .pipe(cssnano())
    .pipe(gulp.dest('dist/css'))
});

gulp.task('scripts', function() {
  return gulp.src('src/js/*.js')
    //.pipe(jshint('.jshintrc'))
    //.pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/img'))
});
// Clean
gulp.task('clean', function() {
  return del(['dist/*']);
});

// Copy all other files to dist directly
gulp.task('copy-html', ['clean'], function() {
 gulp.src(paths.html, {cwd: './'}).pipe(gulp.dest('dist/'));
 gulp.src(paths.scripts, {cwd: './'}).pipe(gulp.dest('dist/js/'));
 gulp.src(paths.fonts, {cwd: './'}).pipe(gulp.dest('dist/fonts/'));
});

// Default task
gulp.task('default', function() {
  gulp.start('styles', 'scripts', 'images');
});

// Watch
gulp.task('watch', ['copy-html', 'default'],  function() {
  gulp.watch('src/scss/**/*.scss', ['styles']);
  gulp.watch('src/js/**/*.js', ['scripts']);
  gulp.watch('src/img/**/*', ['images']);
  gulp.watch('src/pages/*.html', ['copy-html']);
  livereload.listen();
  gulp.watch(['dist/**']).on('change', livereload.changed);
  gulp.watch(['src/icons/**']).on('change', livereload.changed);
  gulp.watch(['src/pages/*.html']).on('change', livereload.changed);
});



