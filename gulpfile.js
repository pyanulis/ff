'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber');

gulp.task('copy', function() {
    gulp.watch('app/**/*.*', function () {
        gulp.src(['app/**/*.*'])
            .pipe(gulp.dest("C:/OpenServer/domains/localhost/ff"));
    });
});

gulp.task('default', ['copy']);