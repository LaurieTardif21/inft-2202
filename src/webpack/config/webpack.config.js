import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  context: path.resolve(__dirname, '../../public'), // Adjust context to the 'public' folder within 'config'
  devtool: 'source-map',
  entry: './index.js', // Entry point relative to the context (public folder)
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '../../../dist'), // Output to the 'dist' folder in the project root
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Adjust the path to your HTML file within 'public'
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
      directory: path.join(__dirname, '../../public'), // Serve content from the public directory
    },
    compress: true,
    port: 9000,
    open: true,
  },
  resolve: {
    fallback: {
      fs: false
    }
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource', // Using Webpack 5 native asset module
        generator: {
          filename: 'img/[name].[contenthash][ext][query]', // Adjust image output path
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