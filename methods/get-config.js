const fs = require("fs");

const defaultConfigFile = path.join(__dirname, "default-config.json");
const defaultConfig = require(defaultConfigFile);
const templateFolder = path.join(__dirname, "template");

/**
 * Returns the gensist config of a folder. The config is merged with the default values.
 * @param {string} folder The folder of which to grab the config.
 *
 */
function getConfig(folder) {
  const getAbsolute = (relativePath) => path.join(folder, relativePath);
  const exists = (path) => fs.existsSync(getAbsolute(path));
  const isFolder = (path) => exists(path) && fs.lstatSync(getAbsolute(path)).isDirectory();

  if (!isFolder("")) {
    error(`Invalid project: "${ folder }".`);
  }

  const hasConfig = exists("gensist.json");
  const userConfig = hasConfig ? require(getAbsolute("gensist.json")) : {};
  const config = Object.assign(defaultConfig, userConfig);
  const hasTemplate = exists(config.template);

  if (!hasTemplate) {
    config.template = path.join(templateFolder, "template.html");
  }

  let style = false;

  if (config.style) {
    if (!(config.style instanceof Array)) {
      error(`The "style"-property in gensist.json must be an array!`);
    }

    if (!config.style.length) {
      return;
    }

    if (config.style.filter((item) => typeof item === "string").length !== config.style.length) {
      error(`The style array in gensist.json may only contain strings!`);
    }

    style = true;
  }

  const meta = {
    hasConfig,
    hasTemplate,
    hasInput: exists(config.input),
    hasStyle: style,
    hasAssets: typeof config.assets === "string" && exists(config.assets)
  };

  return { config, meta };
}