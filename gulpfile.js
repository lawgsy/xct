let gulp = require("gulp");
var ts = require('gulp-typescript');

var clean = require('gulp-clean');

var bases = {
 src: './src',
 dist: './dist',
 app: './app'
};

var paths = {
 main: ['index.html', 'config.js'],
 core: ['core/**', './config.js', '!core/**/*.ts'],
 plugins: ['plugins/**']
};

gulp.task('clean', function () {
  return gulp.src([`${bases.dist}/*`,`${bases.app}/*`], {read: false})
             .pipe(clean());
});

gulp.task('typescript', [], function () {
  return gulp.src(`${bases.src}/**/*.ts`)
             .pipe(ts({ noImplicitAny: false }))
             .pipe(gulp.dest(bases.app));
});

// Copy all other files to dist directly
gulp.task('copy', [], function() {
  gulp.src(paths.main, {cwd: bases.src})
      .pipe(gulp.dest(bases.app));
});
gulp.task('copy-core', [], function() {
  gulp.src(paths.core, {cwd: bases.src})
      .pipe(gulp.dest(bases.app+'/core'));
});
gulp.task('copy-plugins', [], function() {
  gulp.src(paths.plugins, {cwd: bases.src})
      .pipe(gulp.dest(bases.app+'/plugins'));
});

gulp.task('watch', function() {
  gulp.watch(`${bases.src}/plugins/**/*`, ['copy-plugins']);
  gulp.watch(`${bases.src}/core/**`, ['copy-core']);
  gulp.watch(`${bases.src}/common/**`, ['typescript', 'copy']);
  gulp.watch(`${bases.src}/*`, ['typescript', 'copy']);
});

gulp.task('default', ['typescript', 'copy', 'copy-core', 'copy-plugins'])


// NOTE: maybe use electron-connect for live reload instead?
// http://lukasholoubek.com/configuring-an-electron-development-environment/
