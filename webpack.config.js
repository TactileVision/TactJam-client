const HtmlWebpackPlugin = require('html-webpack-plugin');
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
    path: __dirname + '/dist',
    filename: 'main.js'
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
      extensions: ['.tsx', '.ts', '.js', '.gltf'],
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
      path: __dirname + '/dist',
      filename: 'renderer.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html'
      })
    ]
  }

module.exports = [
  electronConfiguration,
  reactConfiguration
];
