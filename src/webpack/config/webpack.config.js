import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  context: path.resolve(__dirname, '../public'), // Set the context to the public directory
  devtool: 'source-map',
  entry: './index.js', // Entry point relative to the context
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Adjust the path to your HTML file
      inject: 'body', // Injects the script tag at the end of the body
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './img', to: 'img' } // Adjust the path to your image directory
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, '../public'), // Serve content from the public directory
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
      }
    ]
  },
};