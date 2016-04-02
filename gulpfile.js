'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    plumber = require('gulp-plumber'),
    browserSync = require("browser-sync");

gulp.task('copy', function() {
    gulp.watch('app/**/*.*', function () {
        gulp.src(['app/**/*.*'])
            .pipe(gulp.dest("C:/OpenServer/domains/localhost/ff"));
    });
});

gulp.task("server", function(){
    browserSync({
        port:9000,
        server:{
            baseDir:"app"
        }
    })
});

gulp.task("watch", function(){
    gulp.watch("app/**/*.*", function(){
        browserSync.reload();
    });
});

gulp.task('default', ['copy', "watch", "server"]);