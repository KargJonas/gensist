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

  if (!isFolder("")) {
    error(`Can't init gensist here: "${ folder }".`);
  }

  const hasConfig = exists("gensist.json");

  if (!hasConfig) {
    console.log(`Generating "gensist.json"`);
    ncp(path.join(templateFolder, "gensist.json"), getAbsolute("gensist.json"), (err) => {
      if (err) throw err;
    });
  }

  const defaultConfig = require(defaultConfigFile);
  const userConfig = hasConfig
    ? require(getAbsolute("gensist.json"))
    : require(path.join(templateFolder, "gensist.json"));
  const config = Object.assign(defaultConfig, userConfig);

  if (!exists(config.input)) {
    console.log(`Generating "${ config.input }/"`);
    ncp(path.join(templateFolder, "content"), getAbsolute("content"), (err) => {
      if (err) throw err;
    });
  }

  if (!exists(config.template)) {
    console.log(`Generating "${ config.template }"`);
    ncp(path.join(templateFolder, "template.html"), getAbsolute("template.html"), (err) => {
      if (err) throw err;
    });
  }

  if (typeof config.assets === "string") {
    console.log(`Generating "${ config.assets }/".`)
    fs.mkdirSync(getAbsolute(config.assets));
  }

  if (config.style instanceof Array) {
    config.style.map((file) => {
      if (exists(file)) return;
      console.log(`Generating "${ file }".`);
      fs.writeFileSync(getAbsolute(file), "");
    });
  }

  console.log("Done.");
}

module.exports = init;