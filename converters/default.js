const markdown = require("./markdown");
const insert = require("./insert");
const minify = require("./minify");

module.exports = (template, file) => {
  return minify(insert(template, { content: markdown(file)}));
};