var webpack = require('webpack');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = {
    entry: {
        smartframes: './web-app/client/src/demo/smartframes/demo.js',
        paragraph: './web-app/client/src/paragraph/app.js',
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].bundle.js',
        path: __dirname + '/temp'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, {
            test: /\.js$/,
            use: [{
                loader: 'babel-loader',
                options: { presets: ['@babel/preset-env'], plugins: ["@babel/plugin-syntax-dynamic-import"]}
            }],
        }]
    },
    plugins: [
        new MinifyPlugin()
    ],
    resolve: {
        modules: [__dirname, 'client', 'node_modules']
    },
    mode: 'production'
};