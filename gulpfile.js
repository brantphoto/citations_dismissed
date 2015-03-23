var gulp = require('gulp');
var del = require('del'); 
var svgmin = require('gulp-svgmin');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
 
var bases = {
 app: 'app/',
 dist: 'dist/',
};
 
var paths = {
 scripts: ['scripts/**/*.js'],
 libs:  ['../node_modules/angular/angular.js', 
        '../node_modules/angular-animate/angular-animate.js', 
        '../bower_components/gsap/src/minified/plugins/ScrollToPlugin.min.js', 
        '../bower_components/angular-waypoints/dist/angular-waypoints.all.min.js', 
        '../node_modules/angular-aria/angular-aria.js',
        '../node_modules/angular-material/angular-material.js',
        '../node_modules/angular-messages/angular-messages.js'],
     
 styles: ['styles/**/*.css'],
 html: ['index.html'],
 images: ['images/**/*.png', 'images/**/*.jpg'],
 extras: ['crossdomain.xml', 'humans.txt', 'manifest.appcache', 'robots.txt', 'favicon.ico'],
};
 
gulp.task('clean:dist', function (cb) {
  del([
    'dist/',
    // here we use a globbing pattern to match everything inside the `mobile` folder
    'dist/**',
    // we don't want to clean this file though so we negate the pattern
    //'!dist/mobile/deploy.json'
  ], cb);
});
 
// Process scripts and concatenate them into one output file
gulp.task('scripts', ['clean:dist'], function() {
 gulp.src(paths.scripts, {cwd: bases.app})
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(uglify())
 .pipe(concat('app.min.js'))
 .pipe(gulp.dest(bases.dist + 'scripts/'));
});

gulp.task('vendorJs', ['clean:dist'], function() {
 gulp.src(paths.libs, {cwd: bases.app})
 .pipe(jshint())
 .pipe(jshint.reporter('default'))
 .pipe(uglify())
 .pipe(concat('vendor.min.js'))
 .pipe(gulp.dest(bases.dist + 'scripts/'));
});
 
// Imagemin images and ouput them in dist
gulp.task('imagemin', ['clean:dist'], function() {
 gulp.src(paths.images)
 .pipe(imagemin())
 .pipe(gulp.dest(bases.dist));
});

gulp.task('svgmin', ['clean:dist'], function() {
      return gulp.src('*.svg')
              .pipe(svgmin())
                      .pipe(gulp.dest(bases.dist));
});

// Copy all other files to dist directly
gulp.task('copy', ['clean:dist'], function() {
 // Copy html
 gulp.src(paths.html, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));
 
 // Copy styles
 gulp.src(paths.styles, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist + 'styles'));
 
 // Copy extra html5bp files
 gulp.src(paths.extras, {cwd: bases.app})
 .pipe(gulp.dest(bases.dist));
});
 
// A development task to run anytime a file changes
gulp.task('watch', function() {
 gulp.watch('app/**/*', ['scripts', 'copy']);
});
 
// Define the default task as a sequence of the above tasks
gulp.task('default', ['clean:dist', 'scripts', 'vendorJs', 'svgmin', 'copy']);
