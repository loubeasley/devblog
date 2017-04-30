import gulp from 'gulp';
import concat from 'gulp-concat';
import wrap from 'gulp-wrap';
import uglify from 'gulp-uglify';
import htmlmin from 'gulp-htmlmin';
import gulpif from 'gulp-if';
import sass from 'gulp-sass';
import yargs from 'yargs';
import ngAnnotate from 'gulp-ng-annotate';
import templateCache from 'gulp-angular-templatecache';
import server from 'browser-sync';
import nodemon from 'gulp-nodemon';
import del from 'del';
import path from 'path';
import child from 'child_process';
import babel from 'gulp-babel';

const exec = child.exec;
const argv = yargs.argv;
const root = 'src/client/';
const paths = {
    dist: 'src/dist/',
    scripts: [`${root}/app/**/*.js`/*, `!${root}/app/!**!/!*.spec.js`*/],
    tests: `${root}/app/**/*.spec.js`,
    styles: [
        `${root}/css/*.css`
    ],
    templates: `${root}/app/**/*.html`,
    modules: [
        'jquery/dist/jquery.min.js',
        'bootstrap/dist/js/bootstrap.min.js',
       'highcharts/highcharts.src.js',
        'angular/angular.js',
        'angular-resource/angular-resource.js',
        'angular-animate/angular-animate.js',
        'angular-sanitize/angular-sanitize.js',
        'angular-messages/angular-messages.js',
        'angular-touch/angular-touch.js',
        'angular-scroll/angular-scroll.min.js',
        'angular-ui-router/release/angular-ui-router.js',
        'highcharts-ng/dist/highcharts-ng.min.js',
        'marked/lib/marked.js',
        'angular-marked/dist/angular-marked.min.js',
        'bootstrap-markdown/js/bootstrap-markdown.js',
        'angular-highlightjs/src/angular-highlightjs.js',
        'angular-markdown-editor/src/angular-markdown-editor.js',
        'angular-utils-ui-breadcrumbs/uiBreadcrumbs.js',
        'toastr/build/toastr.min.js',

    ],
    static: [
        `${root}/index.html`,
        `${root}/fonts/**/*`,
        `${root}/img/**/*`
    ]
};

server.create();

gulp.task('babel', () => {
    return gulp.src(['src/**/*.js', '!src/dist/**', '!src/client/**'])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('clean', cb => del(paths.dist + '**/*', cb));

gulp.task('templates', () => {
    return gulp.src(paths.templates)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(templateCache({
            root: 'app',
            standalone: true,
            transformUrl: function (url) {
                return url.replace(path.dirname(url), '.');
            }
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('modules', ['templates'], () => {
    return gulp.src(paths.modules.map(item => './node_modules/' + item))
        .pipe(concat('vendor.js'))
        .pipe(gulpif(argv.deploy, uglify()))
        .pipe(gulp.dest('build/dist/' + 'js/'));
});

gulp.task('styles', () => {
    return gulp.src(paths.styles)
        .pipe(sass({outputStyle: 'compressed'}))
        //.pipe(concat('style.css'))
        .pipe(gulp.dest('build/dist/' + 'css/'));
});

gulp.task('scripts', ['modules'], () => {
    return gulp.src([
        `!${root}/app/**/*.spec.js`,
        `${root}/app/**/*.module.js`,
        ...paths.scripts,
        './build/templates.js'
    ])
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(wrap('(function(angular){\n\'use strict\';\n<%= contents %>})(window.angular);'))
        .pipe(concat('bundle.js'))
        .pipe(ngAnnotate())
        .pipe(gulpif(argv.deploy, uglify()))
        .pipe(gulp.dest('build/dist/' + 'js/'));
});

var nodemon_inst;

gulp.task('nodemon', ['babel'], (cb) => {
    var callbackCalled = false;
    if (!nodemon_inst) {
        nodemon_inst = nodemon({
            script: `build/app.js`,
            watch: ['nothing']
        })
            .on('start', () => {
                if(!callbackCalled) {
                    callbackCalled = true;
                    cb();
                }
            })
            .on('restart', () => {
                console.log('WOOT');
            });
    } else {
        nodemon_inst.emit('restart');
    }

    //return nodemon_inst;
});

gulp.task('copy', ['clean'], () => {
    return gulp.src(paths.static, {base: 'src/client'})
        .pipe(gulp.dest('build/dist/'));
});

gulp.task('watch', ['nodemon'], () => {
    gulp.watch([paths.scripts, paths.templates], ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(['src/**/*.js', '!src/client/!**'], ['nodemon']);
});

gulp.task('set-dev-node-env', function() {
    return process.env.NODE_ENV = 'production';
});

gulp.task('default', [
    'set-dev-node-env',
    /*'babel',*/
    'copy',
    'styles',
    'scripts',
    'nodemon',
    /*'serve',*/
    'watch'
]);

gulp.task('production', [
    'set-dev-node-env',
    'copy',
    'styles',
    'scripts',
    'nodemon'
]);
