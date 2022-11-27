var webpack = require('webpack');

module.exports = {
    entry: {
        smartframes: './web-app/client/src/demo/smartframes/demo.js',
        paragraph: './web-app/client/src/paragraph/app.js',
        climateDesktop: './web-app/client/src/climate/climateTrends.desktop.js',
        climateMobile: './web-app/client/src/climate/climateTrends.mobile.js',
        videdit: './web-app/client/src/videdit/app.js',
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
    mode: 'development',
    devtool: 'source-map',
};