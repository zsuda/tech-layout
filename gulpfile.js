'use strict';

var gulp = require('gulp');
var sass = require('gulp-ruby-sass');
var sourcemaps = require('gulp-sourcemaps');
var esteWatch = require('este-watch');
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync').create();
var notifier = require('node-notifier');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');

/***   setting   ********************************************************/
var base = __dirname;
var root = base + '/www/assets/';
var setting = {
	SASS: {
		entry: root + 'styles/app/default.scss',
		dest: root + 'styles/',
		options: {
			quiet: true,
			sourcemap: true,
			style: 'compressed' // nested
		}
	},

	JS: {
		entry: root + 'scripts/app/app.js',
		dest: root + 'scripts/',
		merge: root + 'scripts/scripts.js'
	},

	WATCH: {
		indexFile: base + '/index.html',

		dirs: [
			root + 'styles',
			root + 'scripts/app'
		]
	},

	REMOVE: [
		root + 'styles/*.css'
	]
};


/***   remove   *********************************************************/

gulp.task('remove', function()
{
	del(setting.REMOVE, { force: true } );
});


/***   sass   ***********************************************************/

gulp.task('sass', function() {
	sass(setting.SASS.entry, setting.SASS.options)
		.on('error', function (err)
		{
			notifier.notify({ 'title': 'Sass', 'message': err.message });
			console.error('Error!', err.message);
		})
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(setting.SASS.dest))
		.pipe(browserSync.stream());
});

/***   javascript   *****************************************************/

gulp.task('javascript', function() {
	return browserify({ debug: true})
		.require(setting.JS.entry, { entry: true })
		.bundle()
		.on('error', function handleError(err) {
			notifier.notify({ 'title': 'Javascript', 'message': err.toString()});
			console.error(err.toString());
			this.emit('end');
		})
		.pipe(source('scripts.js'))
		.pipe(gulp.dest(setting.JS.dest))
});

gulp.task('uglify', function()
{
	return gulp.src(setting.JS.merge)
		.pipe(sourcemaps.init({loadMaps:true}))
		.pipe(uglify({compress:true}))
		.pipe(gulp.dest(setting.JS.dest));
});


/***   watch   **********************************************************/

gulp.task('watch', function() {

	var watch = esteWatch(setting.WATCH.dirs, function(e) {
		switch (e.extension) {
			case 'scss':
				gulp.start('sass');
				break;
			case 'js':
				gulp.start('javascript');
				break;
		}
	});

	watch.start();
});

/***   server   *********************************************************/

gulp.task('server', function() {
	browserSync.init({
		server: {
			baseDir: "./"
		}
	});

	gulp.watch(setting.WATCH.indexFile, browserSync.reload);
});


gulp.task('default', ['server', 'remove', 'sass', 'javascript', 'uglify'], function()
{
	//runSequence('server','remove','sass', 'javascript');
	gulp.start('watch');
});