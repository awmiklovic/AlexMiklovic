const gulp = require('gulp');
const pug = require('gulp-pug');
const babel = require('gulp-babel');
const clean = require('gulp-clean');
const sass = require('gulp-sass');
const image = require('gulp-image');
 

gulp.task('clean', function(){
  return gulp.src('dist/*')
  .pipe(clean());
});

gulp.task('scripts', ['clean'], () => {

  gulp.src('src/css/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));

  gulp.src('src/js/*.js')
    .pipe(babel({
          presets: ['env']
    }))
    .pipe(gulp.dest('dist/js'));

  gulp.src('src/js/lib/*.js')
    .pipe(gulp.dest('dist/js'));

  gulp.src('src/templates/*.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'));

  gulp.src('src/images/**/*.{svg,png,jpg,gif,mp4}')
    .pipe(gulp.dest('dist/images'));

  gulp.src('src/fonts/*.otf')
    .pipe(gulp.dest('dist/fonts'));

  return gulp.src('src/images/*.{svg,png,jpg,gif,mp4}')
    .pipe(gulp.dest('dist/images'));

});

gulp.task('default', ['scripts']);

gulp.task('watch', function() {
  gulp.watch('src/**/*', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    gulp.run('scripts');
  });
});