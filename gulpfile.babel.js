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

const exec = child.exec;
const argv = yargs.argv;
const root = 'client/';
const paths = {
    dist: './dist/',
    scripts: [`${root}/app/**/*.js`/*, `!${root}/app/!**!/!*.spec.js`*/],
    tests: `${root}/app/**/*.spec.js`,
    styles: [
        /*`node_modules/bootstrap/dist/css/bootstrap.css`,
        `node_modules/bootstrap/dist/css/bootstrap-theme.css`,*/
        `${root}/css/*.css`
    ],
    templates: `${root}/app/**/*.html`,
    modules: [
        'jquery/dist/jquery.min.js',
        'bootstrap/dist/js/bootstrap.min.js',
        'angular/angular.js',
        'angular-resource/angular-resource.js',
        'angular-animate/angular-animate.js',
        'angular-sanitize/angular-sanitize.js',
        'angular-ui-router/release/angular-ui-router.js',
        'marked/lib/marked.js',
        'angular-marked/dist/angular-marked.min.js',
        'bootstrap-markdown/js/bootstrap-markdown.js',
        'angular-highlightjs/src/angular-highlightjs.js',
        'angular-markdown-editor/src/angular-markdown-editor.js',
        'angular-utils-ui-breadcrumbs/uiBreadcrumbs.js',
        'toastr/build/toastr.min.js'
        //'firebase/firebase.js',
        //'angularfire/dist/angularfire.js',
        //'angular-loading-bar/build/loading-bar.min.js'
    ],
    static: [
        `${root}/index.html`,
        `${root}/fonts/**/*`,
        `${root}/img/**/*`
    ]
};

server.create();

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
        .pipe(gulp.dest('./'));
});

gulp.task('modules', ['templates'], () => {
    return gulp.src(paths.modules.map(item => 'node_modules/' + item))
        .pipe(concat('vendor.js'))
        .pipe(gulpif(argv.deploy, uglify()))
        .pipe(gulp.dest(paths.dist + 'js/'));
});

gulp.task('styles', () => {
    return gulp.src(paths.styles)
        .pipe(sass({outputStyle: 'compressed'}))
        //.pipe(concat('style.css'))
        .pipe(gulp.dest(paths.dist + 'css/'));
});

gulp.task('scripts', ['modules'], () => {
    return gulp.src([
        `!${root}/app/**/*.spec.js`,
        `${root}/app/**/*.module.js`,
        ...paths.scripts,
        './templates.js'
    ])
        .pipe(wrap('(function(angular){\n\'use strict\';\n<%= contents %>})(window.angular);'))
        .pipe(concat('bundle.js'))
        .pipe(ngAnnotate())
        .pipe(gulpif(argv.deploy, uglify()))
        .pipe(gulp.dest(paths.dist + 'js/'));
});

/*gulp.task('serve', ['nodemon'], () => {
    return server.init({
        files: [`${paths.dist}/!**`],
        port: 4000,
        /!*server: {
            baseDir: paths.dist
        },*!/
        proxy: 'http://localhost:3000'
    });
});*/

gulp.task('nodemon', (cb) => {
    var callbackCalled = false;
    return nodemon({script: 'app.js'})
        .on('start', () => {
            if(!callbackCalled) {
                callbackCalled = true;
                cb();
            }
        })
});

gulp.task('copy', ['clean'], () => {
    return gulp.src(paths.static, {base: 'client'})
        .pipe(gulp.dest(paths.dist));
});

gulp.task('watch', [/*'serve',*/ 'scripts'], () => {
    gulp.watch([paths.scripts, paths.templates], ['scripts']);
    gulp.watch(paths.styles, ['styles']);
});

/*gulp.task('firebase', ['styles', 'scripts'], cb => {
    return exec('firebase deploy', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});*/

gulp.task('default', [
    'copy',
    'styles',
    'nodemon',
    /*'serve',*/
    'watch'
]);

gulp.task('production', [
    'copy',
    'scripts',
    'firebase'
]);
