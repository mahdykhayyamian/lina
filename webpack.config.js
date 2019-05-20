var webpack = require('webpack');

module.exports = {
    entry: {
        smartframes: './src/client/demo/smartframes/demo.js',
        whiteboard: './src/client/whiteboard/app.js',
        login: './src/client/whiteboard/login.js'
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