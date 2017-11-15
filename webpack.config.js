const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const packageInfo = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = {
  entry: {
    main: [
      'babel-polyfill',
      'react-hot-loader/patch',
      `${__dirname}/app/index.js`,
    ],
  },

  context: __dirname,
  target: 'web',
  devtool: isProduction ? false : 'cheap-module-source-map',

  output: {
    path: path.resolve(__dirname, 'dist', packageInfo.version),
    filename: isProduction ? '[name].[hash].js' : '[name].js',
    publicPath: isProduction ? './' : '/',
  },

  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: ['json-loader', 'yaml-loader'],
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
      },
      {
        test: /\.styl$/,
        loaders: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              plugins: ['transform-react-jsx', 'transform-class-properties'],
            },
          },
        ],
      },
    ],
  },

  resolve: {
    // 解析模块请求的选项
    // （不适用于对 loader 解析）
    modules: [
      'node_modules',
      path.resolve(__dirname, 'app'),
    ],
    // 用于查找模块的目录
    extensions: ['.js', '.json', '.jsx', '.css'],
    // 使用的扩展名
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'app/index.tmpl.html'),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(`dist/${packageInfo.version}`),
  ],

  devServer: {
    host: '0.0.0.0',
    contentBase: __dirname,
    hot: true,
    // public: '10.214.224.115:8080',
  },
}
