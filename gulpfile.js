var gulp = 				require('gulp'),
	sass = 				require('gulp-sass'),
	autoprefixer = 		require('gulp-autoprefixer'),
	sourcemaps = 		require('gulp-sourcemaps'),
	imagemin = 			require('gulp-imagemin'),
	cleanCSS = 			require('gulp-clean-css');
	jshint = 			require('gulp-jshint'),
	uglify = 			require('gulp-uglify'),
	rename = 			require('gulp-rename'),
	clean =				require('gulp-clean'),
	concat = 			require('gulp-concat'),
	notify = 			require('gulp-notify'),
	cache = 			require('gulp-cache'),
	plumber = 			require('gulp-plumber'),
	browserSync =		require('browser-sync'),
	cp = 				require('child_process'),
	runSequence = 		require('run-sequence'),
	favicons =			require("gulp-favicons"),
	gutil =				require("gulp-util"),
	responsive =		require('gulp-responsive-images');

var dir_source = 			'src';
var dir_source_copy = 		'src/_copy';
var dir_source_jekyll =		'src/website'

/*	//////////////////////////////////////////////////////////////////////////////////////////
	Link to the development folder
	-	in the root of the gulp, for templating
	-	in a folder of 'wordpress_dev', for updating the template code of wordpress
	-	change also the jekyll config file!!!
*/
var dir_output = 			'_site';
//var dir_output = 			'__wordpress_dev/themes/sos-temp/dev';
var wp_folder = 			'wordpress_dev/themes/sos-temp';


var path_normalize =		require('node-normalize-scss').includePaths;
var path_resetScss =		require('node-reset-scss').includePath;
var path_bourbon =			require('node-bourbon').includePaths;
var path_bourbon_neat = 	require("bourbon-neat").includePaths;
var path_all_globals = 		[ path_resetScss, path_normalize, path_bourbon, path_bourbon_neat ]

////////////////////////////////////////////////////////////////////////////////////
function handleError (err) {
	console.log(err.toString())
	process.exit(-1)
}
////////////////////////////////////////////////////////////////////////////////////
gulp.task('copy', function () {
	return gulp.src([dir_source+'/_copy/**/*'], {
			base: dir_source + '/_copy'
		})
		.on('error', handleError)
		.pipe(gulp.dest(dir_output+'/assets/libs/'))
		.pipe(browserSync.reload({
			stream: true
		}))
});
////////////////////////////////////////////////////////////////////////////////////
gulp.task('favicon', function () {
	runSequence(['favicon-build'], ['copy']);
});
////////////////////////////////////////////////////////////////////////////////////

gulp.task('favicon-build', function () {
	return gulp.src(dir_source + "/favicon/**/*")
		.pipe(favicons( {
			developerName: "Oscar Smeulders",
			developerURL: "http://oscarsmeulders.com/",
			background: "#FFFFFF",
			path: 'assets/libs/favicon/',
			version: 1.0,
			html: "index.html",
			pipeHTML: true,
			replace: true
		} ))
		.on('error', handleError)
		.pipe(gulp.dest( dir_source_copy + "/favicon/"));

});
////////////////////////////////////////////////////////////////////////////////////
gulp.task('css', function() {
	return gulp.src(dir_source+'/scss/**/styles.scss')
		.pipe(sourcemaps.init())
		.pipe(sass({
				includePaths: path_all_globals
			})
		)

		.pipe(autoprefixer('last 2 version', 'ie 9'))
		.pipe(gulp.dest( dir_output + '/assets/css'))
		.pipe(rename({suffix: '.min'}))
		.pipe(cleanCSS({compatibility: 'ie8'}))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest( dir_output + '/assets/css'))
		.on('error', handleError)
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(notify({ message: 'CSS task complete' }));
});
////////////////////////////////////////////////////////////////////////////////////
gulp.task('js', function() {
    return	gulp.src( [
				dir_source+'/js/**/*.js',
				'!'+dir_source+'/js/_libs',
				'!'+dir_source+'/js/_libs/**',
				'!'+dir_source+'/js/_lib',
				'!'+dir_source+'/js/_lib/**',
				'!'+dir_source+'/js/assets',
				'!'+dir_source+'/js/assets/**'
			])
		.pipe(sourcemaps.init())
		.pipe(concat('scripts.js'))
		.pipe(gulp.dest( dir_output + '/assets/js'))
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest( dir_output + '/assets/js'))
		.on('error', handleError)
		.pipe(browserSync.reload({
			stream: true
		}))
		.pipe(notify({ message: 'JS task complete' }));
});
////////////////////////////////////////////////////////////////////////////////////
// for responsive image add new functions & add them to the sequence
////////////////////////////////////////////////////////////////////////////////////
gulp.task('img', function(){
	// runSequence('img-orginal', 'img-resize-760', 'browser-reload');
	runSequence('img-orginal', 'browser-reload');

});
gulp.task('img-resize-760', function() {
	var size_width = 760; // size in width
	return gulp.src(dir_source+'/images/**/*.+(png|jpg|jpeg|gif)')
		.pipe(responsive({
			'**/*':
				[{ width: size_width }]
			}))
		.pipe(rename({ suffix: '-' + size_width }))
		.pipe(
			cache(imagemin( {interlaced: false} ))
		)
		.pipe(gulp.dest(dir_output+'/assets/images'))

});
gulp.task('img-orginal', function(){
	return gulp.src(dir_source+'/images/**/*.+(png|jpg|jpeg|gif|svg)')
		.pipe(
			cache(imagemin( {interlaced: false} ))
		)
		.pipe(gulp.dest(dir_output+'/assets/images'))

});
////////////////////////////////////////////////////////////////////////////////////
gulp.task('clean', function() {
	return gulp.src([ dir_output ], {read: false})
		.pipe(clean());
});
////////////////////////////////////////////////////////////////////////////////////
/**
 * Build the Jekyll Site
 */
gulp.task('jekyll-build', function (done) {
	browserSync.notify('Building Jekyll');
	return cp.spawn( 'jekyll',
			[	'build',
				'--config', dir_source_jekyll + '/_config.yml', '--trace'],
			{ stdio: 'inherit' }
		)
		.on('close', done);
});
/**
 * Rebuild Jekyll & do page reload
 */
gulp.task('jekyll-rebuild', function () {
	runSequence(['jekyll-build'], ['browser-reload']);
});
////////////////////////////////////////////////////////////////////////////////////
/**
 * create browser-sync instance
 */
gulp.task('browser-sync', function() {
	browserSync({
		server: {
			baseDir: dir_output
		},
		host: "localhost"
	});
});
////////////////////////////////////////////////////////////////////////////////////
gulp.task('browser-reload', function() {
	browserSync.reload();
});

////////////////////////////////////////////////////////////////////////////////////
gulp.task('watch', function() {

	gulp.watch( wp_folder + '/*.php', ['browser-reload']);

	gulp.watch( dir_source + '/scss/**/*', ['css']);
	gulp.watch( dir_source + '/js/**/*', ['js']);
	gulp.watch( dir_source + '/images/**/*', ['img']);
	gulp.watch( dir_source + '/fonts/**/*', ['font']);
	gulp.watch( dir_source + '/_copy/**/*', ['copy']);
	gulp.watch(
		[	dir_source_jekyll + '/*.html',
			dir_source_jekyll + '/*.md',
			dir_source_jekyll + '/_includes/**/*',
			dir_source_jekyll + '/_layouts/**/*',
			dir_source_jekyll + '/_posts/**/*'
		], ['jekyll-rebuild']);
});
////////////////////////////////////////////////////////////////////////////////////
gulp.task('default', function() {
	runSequence('clean', 'browser-sync', ['css', 'js', 'img', 'copy'], 'jekyll-build', ['watch', 'browser-reload']);
});
////////////////////////////////////////////////////////////////////////////////////
gulp.task('build', function() {
	runSequence('clean', ['css', 'js', 'img', 'copy', 'favicon'], 'jekyll-build');
});
////////////////////////////////////////////////////////////////////////////////////






