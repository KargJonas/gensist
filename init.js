const path = require("path");
const ncp = require("ncp");
const fs = require("fs");
const { info, error } = require("./info");

const templateFolder = path.join(__dirname, "template");
const defaultConfigFile = path.join(__dirname, "default-config.json");

function init(folder) {
  const getAbsolute = (relativePath) => path.join(folder, relativePath);
  const exists = (path) => fs.existsSync(getAbsolute(path));
  const isFolder = (path) => exists(path) && fs.lstatSync(getAbsolute(path)).isDirectory();

  function copyFromTemplate(fileName, newFileName = fileName) {
    console.log(`Generating "${ newFileName }"`);
    ncp(path.join(templateFolder, fileName), getAbsolute(newFileName), (err) => {
      if (err) throw err;
    });
  }

  if (!isFolder("")) {
    error(`Can't init gensist here: "${ folder }".`);
  }

  const hasConfig = exists("gensist.json");

  if (!hasConfig) {
    copyFromTemplate("gensist.json");
  }

  const defaultConfig = require(defaultConfigFile);
  const userConfig = hasConfig
    ? require(getAbsolute("gensist.json"))
    : require(path.join(templateFolder, "gensist.json"));
  const config = Object.assign(defaultConfig, userConfig);

  if (!exists(config.input)) {
    copyFromTemplate("content", config.input);
  }

  if (!exists(config.template)) {
    copyFromTemplate("template.html", config.template);
  }

  info("Initialized successfully!");
  return 0;
}

module.exports = init;