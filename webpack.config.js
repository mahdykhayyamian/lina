var webpack = require('webpack');

var PROD = JSON.parse(process.env.PROD_ENV || '0');

module.exports = {
    entry: {
        smartframes: './src/client/demo/smartframes/demo.js',
        whiteboard: './src/client/whiteboard/app.js'
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
    plugins: PROD ? [
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    ] : [],
    resolve: {
        modules: [__dirname, 'client', 'node_modules']
    },
    mode: 'development'
};