const gulp = require('gulp')
const babel = require('gulp-babel');
const uglify = require ('gulp-uglify'); 

gulp.task('default', () =>
    gulp.src('public_src/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('public/js/'))
);