
const gulp = require('gulp');             // gulp
const notify = require('gulp-notify');    // デスクトップに通知を表示
const plumber = require('gulp-plumber');  // エラー時にもタスクを終了させない

const pug = require('gulp-pug');          // pugファイルをhtmlにコンパイル
const sass = require('gulp-sass')(require('sass')); // scssファイルをcssにコンパイル
const autoprefixer = require('gulp-autoprefixer');  // cssにベンダープレフィックスを追加する
const webpack = require('webpack');       // webpack
const webpackStream = require('webpack-stream'); // webpackを使うために必要なプラグイン

const browserSync = require('browser-sync').create(); // browser-sync

// ディレクトリ
const dir = {
  src: './src',
  dist: './htdocs'
};

//Pug
gulp.task('pug', (done) => {
  return gulp.src([dir.src + '/**/*.pug', '!' + dir.src + '/**/_*.pug'])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug())
    .pipe(gulp.dest(dir.dist));
  done();
});

//Scss
gulp.task('scss', (done) => {
  gulp.src(dir.src + '/**/*.scss', {base: dir.src + '/_assets/scss'})
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(dir.dist + '/_assets/css'));
  done();
});

// Js
gulp.task('script', (done) => {
  const webpackConfig = require('./webpack.config');  // webpackの設定ファイルの読み込み
  gulp.src([dir.src + '/_assets/js/index.js'])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(dir.dist + '/_assets/js'))
  done();
});

// ブラウザ自動リロード【初期化タスク】
gulp.task('browser-sync-init', (done) => {
  browserSync.init({
    server: {
      baseDir: dir.dist
    },
    port: 3000
  });
  done();
});
// ブラウザ自動リロード【リロードタスク】
gulp.task('browser-reload', (done) => {
  browserSync.reload();
  done();
});

// 監視タスク
gulp.task('watch-files', (done) => {
  gulp.watch(dir.dist + '/**.html', gulp.task('browser-reload'));
  gulp.watch(dir.dist + '/**/**.css', gulp.task('browser-reload'));
  gulp.watch(dir.dist + '/**/**.js', gulp.task('browser-reload'));
  gulp.watch(dir.src + '/**/*.pug', gulp.task('pug'));
  gulp.watch(dir.src + '/_assets/scss/**/*.scss', gulp.task('scss'));
  gulp.watch(dir.src + '/_assets/js/**/*.js', gulp.task('script'));
  done();
});

// タスクの実行
gulp.task('default',
  gulp.series(
    'browser-sync-init', 
    gulp.parallel('pug', 'scss', 'script'), 
    'watch-files', 
    function(done) {
      done();
    }
  )
);
