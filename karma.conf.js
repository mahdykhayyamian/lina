var webPackConfig = require('./webpack.config.js');

module.exports = (config) => {
  config.set({
    captureConsole: true,
    singleRun: false,
    autoWatch: true,
    files: [
      { pattern: 'web-app/client/test/**/*.test.js', watched: false },
    ],
    frameworks: ['jasmine'],
    reporters: ['spec'],
    preprocessors: {
      'web-app/client/test/**/*.test.js': ['webpack'],
    },
    webpack: webPackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
  });
};