const minify = require("html-minifier").minify;
const minifyConf = {
  minifyCSS: true,
  minifyJS: true,
  collapseWhitespace: true,
};

module.exports = (html) => minify(html, minifyConf);