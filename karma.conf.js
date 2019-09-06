module.exports = (config) => {
  config.set({
    // ... normal karma configuration
    files: [
      // all files ending in "_test"
      { pattern: 'web-app/client/test/**/*spec.js', watched: false },
      // each file acts as entry point for the webpack configuration
    ],
    frameworks: ['jasmine'],
    reporters: ['spec'],
    webpack: {
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
        resolve: {
            modules: [__dirname, 'client', 'node_modules']
        },
        mode: 'development'
    },
    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      stats: 'errors-only',
    },
  });
};