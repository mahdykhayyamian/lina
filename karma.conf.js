const webPackConfig = require('./webpack.config.js');
const puppeteer = require('puppeteer');
process.env.CHROME_BIN = puppeteer.executablePath();

module.exports = (config) => {
  config.set({
    browsers: ['ChromeHeadless'],
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