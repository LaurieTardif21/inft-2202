const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development', // Or 'production' for a production build
    entry: './public/index.js',
    //entry: './src/index.js', // Your entry point (where your app starts)
    output: {
        filename: 'bundle.js', // The name of the output bundle file
        path: path.resolve(__dirname, 'dist'), // Where to put the bundled file, creates a dist folder
        clean: true,
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        port: 9000, // Or any other available port
        hot: true, // Enable hot module replacement
        open: true, //open the browser on start
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|gif|svg)$/i, //this regex will check the files extension
                type: 'asset/resource', //the files will be copied to the output dir
                generator: {
                    filename: 'images/[name][ext]',
                },
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i, //this regex will check the fonts extension
                type: 'asset/resource', //the files will be copied to the output dir
                generator: {
                    filename: 'fonts/[name][ext]',
                },
            },
            {
                test: /\.css$/i, //this regex will check the files extension
                use: ['style-loader', 'css-loader'], // these loaders will load the css files
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // Path to your existing HTML file
            filename: 'index.html', // Output filename in the 'dist' folder
            inject: 'body', // Inject the generated script tag into the <body>
        }),
        new CopyPlugin({
            patterns: [
                { from: "public", to: "public" },
            ],
        }),
    ],
};