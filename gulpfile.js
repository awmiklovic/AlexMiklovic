const gulp = require('gulp');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const image = require('gulp-image');
const imagemin = require('gulp-imagemin');

gulp.task('clean', function(){
  return gulp.src(['docs/*', '!CNAME'])
  .pipe(clean());
});

gulp.task('scripts', ['clean'], () => {

  gulp.src('src/CNAME')
    .pipe(gulp.dest('docs'));

  gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('docs/css'));

  gulp.src('src/js/*.js')
    .pipe(babel({
          presets: ['env']
    }))
    .pipe(gulp.dest('docs/js'));

  gulp.src('src/js/lib/*.js')
    .pipe(gulp.dest('docs/js'));

  gulp.src('src/templates/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('docs'));

  gulp.src('src/images/**/*.{svg,png,jpg,gif,mp4}')
    .pipe(imagemin())
    .pipe(gulp.dest('docs/images'));

  gulp.src('src/fonts/*.otf')
    .pipe(gulp.dest('docs/fonts'));

  return gulp.src('src/images/*.{svg,png,jpg,gif,mp4}')
    .pipe(imagemin({
      interlaced: true,
      progressive: true,
      optimizationLevel: 5
    }))
    .pipe(gulp.dest('docs/images'));

});

gulp.task('default', ['scripts']);

gulp.task('watch', function() {
  gulp.watch('src/**/*', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    gulp.run('scripts');
  });
});