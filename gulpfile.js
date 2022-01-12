
const gulp = require('gulp');             // gulp
const notify = require('gulp-notify');    // デスクトップに通知を表示
const plumber = require('gulp-plumber');  // エラー時にもタスクを終了させない

const pug = require('gulp-pug');          // pugファイルをhtmlにコンパイル
const sass = require('gulp-sass')(require('sass')); // scssファイルをcssにコンパイル
const autoprefixer = require('gulp-autoprefixer');  // cssにベンダープレフィックスを追加する
const imagemin = require('gulp-imagemin');          // 画像圧縮（一般）
const mozjpeg = require('imagemin-mozjpeg');        // 画像圧縮（jpeg）
const pngquant = require('imagemin-pngquant');      // 画像圧縮（png）
const webpack = require('webpack');       // webpack
const webpackStream = require('webpack-stream'); // webpackを使うために必要なプラグイン

const browserSync = require('browser-sync').create(); // browser-sync

const { src, watch, series, parallel } = require('gulp');  // gulp機能

// ディレクトリ
const dir = {
  src: './src',
  dist: './htdocs'
};

//Pug
const pugCompile = () => {
  return src([dir.src + '/**/*.pug', '!' + dir.src + '/**/_*.pug'])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(pug())
    .pipe(gulp.dest(dir.dist));
};

//Scss
const scssCompile = () => {
  return src(dir.src + '/**/*.scss', {base: dir.src + '/_assets/scss'})
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(dir.dist + '/_assets/css'));
};

// Js
const jsCompile = () => {
  const webpackConfig = require('./webpack.config');  // webpackの設定ファイルの読み込み
  return src([dir.src + '/_assets/js/index.js'])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(webpackStream(webpackConfig, webpack))
    .pipe(gulp.dest(dir.dist + '/_assets/js'));
};

// 画像
const imageCompress = () => {
  return src([dir.src + '/_assets/images/**/*.*'])
    .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
    .pipe(imagemin([
        imagemin.svgo(),
        imagemin.optipng(),
        pngquant({
          quality: [.80, .90],    // [.60, .70]とした場合、60〜70%程度の画質で圧縮
          speed: 1 // スピード
        }),
        mozjpeg({ quality: 85 }), // 画質
        imagemin.gifsicle({ optimizationLevel: 3 })   // 圧縮率
      ])
    )
    .pipe(gulp.dest(dir.dist + '/_assets/images'));
};

// ブラウザ自動リロード【初期化タスク】
const browserSyncInit = (done) => {
  browserSync.init({
    server: {
      baseDir: dir.dist
    },
    port: 3000
  })
  done();
};
// ブラウザ自動リロード【リロードタスク】
const browserReload = (done) => {
  browserSync.reload();
  done();
};

// 監視タスク
const watchFiles = (done) => {
  watch(dir.dist + '/**.html', browserReload);
  watch(dir.dist + '/**/**.css', browserReload);
  watch(dir.dist + '/**/**.js', browserReload);
  watch(dir.dist + '/**/images/**/*.*', browserReload);
  watch(dir.src + '/**/*.pug', pugCompile);
  watch(dir.src + '/_assets/scss/**/*.scss', scssCompile);
  watch(dir.src + '/_assets/js/**/*.js', jsCompile);
  watch(dir.src + '/_assets/images/**/*.*', imageCompress);
  done();
};

// タスクの実行
exports.default = series(
  parallel(pugCompile, scssCompile, jsCompile, imageCompress),
  browserSyncInit,
  watchFiles
);