import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  devtool: 'source-map',
  entry: './index.js', // Corrected: index.js is directly in webpack folder
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Corrected: will be created inside webpack
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Corrected: index.html is directly in webpack folder
      inject: 'body',
    }),
    new CopyWebpackPlugin({
      patterns: [
        // Remove if you dont have img folder, if you want it, create it.
        { from: './img', to: 'img' }, // Corrected: img is directly in webpack folder
      ],
    }),
  ],
  devServer: {
    static: {
      directory: __dirname, // Corrected: serve from current directory
    },
    compress: true,
    port: 9000,
    open: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        loader: 'file-loader',
        options: {
          esModule: false,
          name: '[name].[contenthash].[ext]',
          outputPath: 'img',
        },
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          esModule: false,
        },
      },
    ],
  },
};