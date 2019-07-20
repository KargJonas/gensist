const { info, error } = require("./info");
const files = require("./files");
const getConfig = require("./get-config");

function init(folder) {
  const { exists, isFolder, copyFromTemplate } = files(folder);
  const { config, meta } = getConfig(folder);

  if (!isFolder("")) {
    error(`Can't init gensist here: "${ folder }".`);
  }

  if (!meta.hasConfig) {
    copyFromTemplate("gensist.json");
  }

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