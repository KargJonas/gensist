const transform = require("file-tree-transform");
const converter = require("./converters/default");
const path = require("path");
const ncp = require("ncp");
const fs = require("fs");

const configFile = "config/gensist.json";
const defaultConfigFile = path.join(__dirname, "default-config.json");

function build(folder) {
  if (!fs.existsSync(folder) || !fs.lstatSync(folder).isDirectory()) {
    throw new Error(`Can't build here: "${ folder }"`);
  }

  const configLocation = path.join(folder, configFile);
  const hasConfig = fs.existsSync(configLocation);
  let config = require(defaultConfigFile);

  if (hasConfig) {
    const userConfig = require(configLocation);
    Object.assign(config, userConfig);
  }

  const inputDir = path.join(folder, config.input);
  const outputDir = path.join(folder, config.output);
  const templateFile = path.join(folder, config.template);
  const template = fs.readFileSync(templateFile).toString();

  transform(inputDir, outputDir, ({ input, name }) => ({
    output: converter(template, input),
    name: `${ name.slice(0, name.length - 3) }.html`
  }));

  const assetsDir = path.join(folder, config.assets);
  const hasAssets = fs.existsSync(assetsDir);

  if (hasAssets) {
    ncp(assetsDir, path.join(outputDir, "assets"), (err) => {
      if (err) throw err;
      console.log("Done.");
    });
  }
}

module.exports = build;