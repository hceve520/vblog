const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const zopfli = require('@gfx/zopfli');
const appConfig = require('../config');

const config = {
  context: __dirname,
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  entry: {
    app: './index.jsx'
  },

  output: {
    publicPath: '/entry/assets/',
    filename: '[name].js',
    chunkFilename: '[name].js',
    path: path.resolve('.package')
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      components: path.join(__dirname, './components'),
      utils: path.join(__dirname, './utils'),
      styles: path.join(__dirname, './styles'),
      pages: path.join(__dirname, './pages'),
      store: path.join(__dirname, './store')
    }
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,

        use: {
          loader: 'babel-loader',

          options: {
            cacheDirectory: path.join(
              __dirname,
              '.honeypack_cache/babel-loader'
            ),
            presets: ['@babel/preset-env','@babel/preset-react'],

            plugins: [
              'add-module-exports',
              ['@babel/plugin-proposal-decorators', { 'legacy': true }],
              'transform-class-properties'
              // 'transform-object-rest-spread',
              // ['import', { libraryName: 'antd', style: true }]
            ]
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,

        use: {
          loader: 'file-loader',

          options: {
            name: '[name].[ext]',
            outputPath: 'images/'
          }
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,

        use: {
          loader: 'file-loader',

          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }
      },
      {
        test: /\.(less|css)$/,

        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'less-loader',

            options: {
              javascriptEnabled: true
            }
          }
        ]
      }
    ]
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'react-router': 'ReactRouter',
    'lodash': '_',
    'bizcharts': 'BizCharts',
    'intl': 'Intl',
    'echarts':'echarts',
    antd:'antd',
    'nprogress':'NProgress',
    'react-quill':'ReactQuill',
    'prop-types':'PropTypes',
    'highlight.js':'hljs'
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })

  ],
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        cache: path.join(__dirname, '.honeypack_cache/terser-webpack-plugin'),
        parallel: true
      })
    ],

    splitChunks: {
      cacheGroups: {
        commons: {
          test: module =>
            /[\\/]node_modules[\\/]/.test(module.resource) &&
            module.constructor.name !== 'CssModule',
          name: 'vendor',
          chunks: 'all'
        }
      }
    }
  }
};
if(appConfig.env!='dev'){
  config.plugins.push(
    new CompressionPlugin({
      test: /\.(js|css)$/,
      compressionOptions: {
        numiterations: 15
      },
      algorithm(input, compressionOptions, callback) {
        return zopfli.gzip(input, compressionOptions, callback);
      }
    })
  )
}

module.exports = config;
