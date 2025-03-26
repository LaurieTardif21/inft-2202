import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  context: path.resolve(__dirname, '../../public'),
  devtool: 'source-map',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../../dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './img', to: 'img' }
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../../public'),
    },
    compress: true,
    port: 9000,
    open: true,
  },
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'), // Polyfill for path module
      timers: require.resolve('timers-browserify'), // Polyfill for timers module
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'img/[name].[contenthash][ext][query]',
        },
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          esModule: false,
        },
      }
    ]
  },
};