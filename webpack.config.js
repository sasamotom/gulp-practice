const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: "production",
  // メインのJS
  entry: './src/_assets/js/index.js',
  // 出力ファイル
  output: {
    filename: 'app.js',
    // chunkFilename: 'vendor.js'
  },
  optimization: {
    minimizer: [new TerserPlugin({
      extractComments: false,
    })],
  //   splitChunks: {
  //     cacheGroups: {
  //       commons: {
  //         test: /[\\/]node_modules[\\/]/,
  //         chunks: 'initial'
  //       }
  //     }
  //   }
  },
  // devtool: false,
  // module: {
  //   rules: [
  //     {
  //       test: /\.js$/,
  //       exclude: /node_modules/,
  //       use: {
  //         loader: 'babel-loader'
  //       }
  //     }
  //   ]
  // },
  // plugins: [
  //   new webpack.SourceMapDevToolPlugin({
  //     append: DEBUG ? '\n//# sourceMappingURL=[url]' : false,
  //     filename: '../sourcemaps/[file].map'
  //   }),
  //   new webpack.ProvidePlugin({
  //     $: 'jquery',
  //     jQuery: 'jquery'
  //   })
  // ]
};
