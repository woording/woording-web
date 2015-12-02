'use strict';

// requirements
var gulp = require('gulp');
var sass = require('gulp-sass');
var process = require('child_process');
var shell = require('gulp-shell');
var autoprefixer = require('gulp-autoprefixer');


var paths = {
	styles: {
		src: 'static/scss/**/*.scss',
		dest: 'static/css/'
	}
};

gulp.task('default', ['scss', 'scss_watch', 'start_server']);

gulp.task('scss_watch', function() {
	gulp.watch(paths.styles.src, ['scss']);
});

gulp.task('scss', function() {
	gulp.src(paths.styles.src)
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest(paths.styles.dest))
});

gulp.task('start_server', shell.task(['python3 site.py']));