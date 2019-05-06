const showdown = require("showdown");
const converter = new showdown.Converter({
  "noHeaderId": true,
  parseImgDimensions: true
});

module.exports = (text) => converter.makeHtml(text);