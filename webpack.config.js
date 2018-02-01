const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const packageInfo = require('./package.json')

const isProduction = process.env.NODE_ENV === 'production'

module.exports = (env) => {
  console.log('port:', env.port)
  return {
    entry: {
      main: ['babel-polyfill', 'react-hot-loader/patch', `${__dirname}/app/index.js`],
    },

    context: __dirname,
    target: 'web',
    devtool: isProduction ? false : 'cheap-module-source-map',

    output: {
      path: path.resolve(__dirname, 'dist', `${packageInfo.version}/${env.port}`),
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
      modules: [path.resolve(__dirname, 'app'), 'node_modules'],
      // 用于查找模块的目录
      extensions: ['.js', '.json', '.jsx', '.css', '.styl'],
      // 使用的扩展名
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'app/index.tmpl.html'),
      }),
      new webpack.NamedModulesPlugin(),
      new webpack.HotModuleReplacementPlugin(),
      new webpack.DefinePlugin({
        PORT: JSON.stringify(env.port),
        PRODUCTION: JSON.stringify(isProduction),
        'process.env': {
          NODE_ENV: JSON.stringify('production'),
        },
      }),
    ].concat(isProduction
      ? [
        new CleanWebpackPlugin(`dist/${packageInfo.version}/${env.port}`),
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false,
          },
        }),
      ]
      : []),

    devServer: {
      host: '0.0.0.0',
      contentBase: __dirname,
      hot: true,
      port: env.port,
      // public: '10.214.224.111:9000',
    },
  }
}
