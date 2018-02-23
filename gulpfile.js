var gulp = require('gulp');
var uglify = require('gulp-uglify');

var concat = require('gulp-concat');
var rename = require('gulp-rename');


gulp.task('prod', function() {
    return gulp.src([
                      './parallax.js',
                    ])
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
       .pipe(gulp.dest('./'));
});


/*
var minifyjs = require('gulp-js-minify');

gulp.task('prod', function() {
    gulp.src('./parallax.js')
        .pipe(minifyjs())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./'));
});*/