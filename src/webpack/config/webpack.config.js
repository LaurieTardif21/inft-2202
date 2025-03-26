import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  context: __dirname, // Base directory for resolving entry points and loaders
  devtool: 'source-map',
  entry: './src/webpack/index.js', // Entry point relative to the context (current directory)
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'), // Output to the 'dist' folder in the current directory
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html', // Path to your HTML file within the current directory
      inject: 'body', // Injects the script tag at the end of the body
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './img', to: 'img' } // Path to your image directory
      ]
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'), // Serve content from the public directory
    },
    compress: true,
    port: 9000,
    open: true,
  },
  resolve: {
    fallback: {
      fs: false,
      path: require.resolve('path-browserify'),
      timers: require.resolve('timers-browserify')
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