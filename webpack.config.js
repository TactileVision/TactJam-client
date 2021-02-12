const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

// Electron Webpack Configuration
const electronConfiguration = {
  // Build Mode
  mode: 'development',
  // Electron Entrypoint
  entry: './src/main.ts',
  target: 'electron-main',
  resolve: {
    alias: {
        ['@']: path.resolve(__dirname, 'src'),
        assets: path.resolve(__dirname, 'assets'),
    },
    extensions: ['.tsx', '.ts', '.js', '.gtlf'],
  },
  module: {
    rules: [{
      test: /\.ts$/,
      include: /src/,
      use: [{ loader: 'ts-loader' }]
    },
    {
        test: /\.(gltf)(\?.*)?$/,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name][md5:hash].[ext]', // Name of bundled asset
                outputPath: 'webpack-assets/', // Output location for assets. Final: `app/assets/webpack/webpack-assets/`
                // publicPath: '/assets/webpack-assets/' // Endpoint asset can be found at on Rails server
            }
        }
    }
    ]
  },
  output: {
    path: __dirname + '/build',
    filename: 'main.js'
  },
    externals: {
      serialport: 'commonjs2 serialport'
    }
}

const reactConfiguration = {
    mode: 'development',
    entry: './src/renderer.tsx',
    target: 'electron-renderer',
    devtool: 'source-map',
    resolve: {
      alias: {
        ['@']: path.resolve(__dirname, 'src'),
        assets: path.resolve(__dirname, 'assets'),
      },
      extensions: ['.tsx', '.ts', '.js', '.gltf', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }]
        },
        {
          test: /\.(gltf)(\?.*)?$/,
          use: {
              loader: 'file-loader',
              options: {
                  name: '[name][md5:hash].[ext]', // Name of bundled asset
                  outputPath: 'webpack-assets/', // Output location for assets. Final: `app/assets/webpack/webpack-assets/`
                  // publicPath: '/assets/webpack-assets/' // Endpoint asset can be found at on Rails server
              }
          }
        }
      ]
    },
    output: {
      path: __dirname + '/build',
      filename: 'renderer.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new webpack.ExternalsPlugin('commonjs', [
            'electron'
        ])
    ]
  }

module.exports = [
  electronConfiguration,
  reactConfiguration
];

