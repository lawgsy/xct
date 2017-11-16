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

gulp.task('typescript', ['clean'], function () {
  return gulp.src(`${bases.src}/**/*.ts`)
             .pipe(ts({ noImplicitAny: false }))
             .pipe(gulp.dest(bases.app));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean'], function() {
  gulp.src(paths.main, {cwd: bases.src})
      .pipe(gulp.dest(bases.app));
});
gulp.task('copy-core', ['clean'], function() {
  gulp.src(paths.core, {cwd: bases.src})
      .pipe(gulp.dest(bases.app+'/core'));
});
gulp.task('copy-plugins', ['clean'], function() {
  gulp.src(paths.plugins, {cwd: bases.src})
      .pipe(gulp.dest(bases.app+'/plugins'));
});

gulp.task('watch', function() {
  gulp.watch(`${bases.src}/plugins/**`, ['copy-plugins']);
  gulp.watch(`${bases.src}/core/**`, ['copy-core']);
  gulp.watch(`${bases.src}/common/**`, ['clean', 'typescript', 'copy']);
  gulp.watch(`${bases.src}/*`, ['clean', 'typescript', 'copy']);
});

gulp.task('default', ['clean', 'typescript', 'copy', 'copy-core', 'copy-plugins'])
