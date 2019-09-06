var webPackConfig = require('./webpack.config.js');

module.exports = (config) => {
  config.set({
    singleRun: true,
    autoWatch: true,
    files: [
      { pattern: 'web-app/client/test/**/*spec.js', watched: false },
    ],
    frameworks: ['jasmine'],
    reporters: ['spec'],
    preprocessors: {
      'web-app/client/test/**/*spec.js': ['webpack'],
    },
    webpack: webPackConfig,
    webpackMiddleware: {
      stats: 'errors-only',
    },
  });
};