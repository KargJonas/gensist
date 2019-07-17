const cssNano = require("cssnano");

const postCssConf = { from: undefined };
const cssNanoConf = { preset: "default" };

module.exports = function (input) {
  return cssNano.process(input, postCssConf, cssNanoConf);
}