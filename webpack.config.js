const path = require('path');
const webpack = require('webpack');
const fs = require('fs');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const LICENSE = fs.readFileSync('LICENSE', 'utf8');

module.exports = {
    entry: './src/WebSocketUtils.js',
    mode: "production",
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        library: "WebSocketUtils",
        libraryExport: "default",
        libraryTarget: "umd",
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    optimization: {
        minimize: true
    },
    plugins: [
        new CleanWebpackPlugin(),
        new webpack.BannerPlugin({
            banner: LICENSE
        }),
    ],
};
