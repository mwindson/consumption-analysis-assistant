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
            }
          }
        ]
      }
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
        template: __dirname + '/app/index.tmpl.html',
      }
    )
  ],

  devServer: {
    host: '0.0.0.0',
  }
}
