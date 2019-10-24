const path = require('path');

const vueSrc = './src';

module.exports = {
  publicPath: '.',
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, vueSrc),
      },
    },
  },
};
