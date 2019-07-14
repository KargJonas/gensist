const minify = require("html-minifier").minify;
const minifyConf = {
  minifyCSS: true,
  minifyJS: true,
  collapseWhitespace: true,
  removeComments: true
};

module.exports = (html) => minify(html, minifyConf);