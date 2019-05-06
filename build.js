const transform = require("file-tree-transform");
const path = require("path");
const fs = require("fs");

const configName = "gensist.default.js";
const defaultConfig = "./default.config.js";

function build(folder) {
  if (!fs.existsSync(folder) || !fs.lstatSync(folder).isDirectory()) {
    throw new Error(`Can't build here: "${ folder }"`);
  }

  const configLocation = path.join(folder, configName);
  const hasConfig = fs.existsSync(configLocation);
  const config = hasConfig
    ? require(configLocation)
    : require(defaultConfig);


}

module.exports = build;