var webpack = require('webpack');

module.exports = {
    entry: {
        smartframes: './web-app/client/demo/smartframes/demo.js',
        paragraph: './web-app/client/paragraph/app.js',
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
    resolve: {
        modules: [__dirname, 'client', 'node_modules']
    },
    mode: 'development'
};