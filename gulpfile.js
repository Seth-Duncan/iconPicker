// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),


  // development mode?
  devBuild = (process.env.NODE_ENV !== 'production'),

  // folders
  folder = {
    src: 'src/',
    build: 'build/'
  };

  // JavaScript processing
gulp.task('js', function() {

  var jsbuild = gulp.src(folder.src + 'js/**/*')
    .pipe(deporder())
    .pipe(concat('kiconselect.min.js'));

  
    jsbuild = jsbuild
        .pipe(stripdebug())
        .pipe(uglify());
  

  return jsbuild.pipe(gulp.dest(folder.build + 'js/'));

});

// CSS processing
gulp.task('css', function() {

  var postCssOpts = [
  assets({ loadPaths: ['images/'] }),
  autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
  mqpacker
  ];

  if (!devBuild) {
    postCssOpts.push(cssnano);
  }

  return gulp.src(folder.src + 'scss/**/*')
    .pipe(sass({
      outputStyle: 'nested',
      imagePath: 'images/',
      precision: 3,
      errLogToConsole: true
    }))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(folder.build + 'css/'));

});

// run all tasks
gulp.task('run', ['css', 'js']);

// watch for changes
gulp.task('watch', function() {


  // javascript changes
  gulp.watch(folder.src + 'js/**/*', ['js']);

  // css changes
  gulp.watch(folder.src + 'scss/**/*', ['css']);

});

// default task
gulp.task('default', ['run', 'watch']);