const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const packageInfo = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    main: [
      __dirname + "/app/index.js"
    ]
  },

  context: __dirname,
  target: 'web',
  devtool: isProduction ? false : 'cheap-module-source-map',

  output: {
    path: path.resolve(__dirname, 'build', packageInfo.version),
    filename: 'bundle.js',
    publicPath: '/'
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css.style-loader', 'stylus-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      }
    ],
  },

  resolve: {
    modules: ['node_modules', path.resolve(__dirname, 'app')],
    extensions: ['.js', '.jsx'],
  },

  plugins: [
    new HtmlWebpackPlugin({
        template: __dirname + '/app/index.tmpl.html',
      }
    )
  ],

  devServer: {
    host: '0.0.0.0',
  }
}
