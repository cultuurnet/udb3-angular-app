//const path = require('path');
const webpack = require('webpack');

/*module.exports = {
  mode: 'development',
  entry: './app/scripts/app.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  }
};*/

module.exports = {
  mode: 'development',
  context: __dirname + '/app',
  watch: true,
  entry: {
    app: './scripts/app.js',
    vendor: ['es5-shim', 'angular', 'json3', 'bootstrap', 'angular-resource',
      'angular-cookies', 'angular-sanitize', 'angular-touch',
      'angular-markdown-directive', '@uirouter/angularjs', 'angular-zendesk-widget',
      'ng-meta', 'angular-deferred-bootstrap', 'angular-translate-once',
      'angular-translate-storage-cookie', 'angular-dynamic-locale',
      'udb3-angular']
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: __dirname + '/app',
    port: 9999,
    watchContentBase: true,
    hot: true
  },
  output: {
    path: __dirname + '/app',
    filename: '[name].bundle.js',
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  },
  plugins: [
    /*new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'Hot Module Replacement'
    }),*/
    new webpack.HotModuleReplacementPlugin()
  ]
};
