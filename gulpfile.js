var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync').create();

gulp.task('default', ['styles'], function() {
	gulp.watch('assets/css/**/*.scss', ['styles']);
	gulp.watch('index.html', ['styles']);

	browserSync.init({
		server: './'
	});
});

gulp.task('styles', function() {
	gulp.src('assets/css/**/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 2 versions']
		}))
		.pipe(gulp.dest('./assets/css'))
		.pipe(browserSync.stream());
	gulp.src('index.html')
	.pipe(browserSync.stream());
});
