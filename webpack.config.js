const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const outDir = 'assets'
const isProd = /\s(--mode production|-p)/.test(process.argv.join(' '))

const conf = {
  entry: {
    index: './client/src/index.js'
  },
  output: {
    path: `${__dirname}/${outDir}`,
    filename: '[name].js'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        // exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              ['@babel/plugin-transform-react-jsx', { pragma: 'h' }],
              '@babel/plugin-proposal-class-properties'
            ]
          }
        }
      }, {
        test: /\.css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          { loader: 'css-loader' }
        ]
      }, {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'imgs/[name][hash].[ext]'
            }
          }
        ]
      }, {
        test: /\.(eot|svg|ttf|woff2?)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'fonts/[name][hash].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  devServer: {
    // host: '0.0.0.0',
    hot: true,
    contentBase: [`./${outDir}`, './test/html']
  }
}

if (isProd) {
  Object.assign(conf, {
    mode: 'production',
    devtool: false // 'source-map'
  })
  conf.plugins = conf.plugins.concat([
    new webpack.BannerPlugin({
      banner: '@copyright 2014- commenthol\n@license MIT'
    })
  ])
} else {
  conf.plugins = conf.plugins.concat([
    new webpack.HotModuleReplacementPlugin({})
  ])
}

module.exports = conf
