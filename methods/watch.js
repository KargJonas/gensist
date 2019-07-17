const build = require("./build");
const chokidar = require("chokidar");
const browserSync = require("browser-sync").create();
const path = require("path");
const fs = require("fs");

const defaultConfigFile = path.join(__dirname, "default-config.json");

function watch(folder) {
  const getAbsolute = (relativePath) => path.join(folder, relativePath);
  const exists = (path) => fs.existsSync(getAbsolute(path));
  const isFolder = (path) => exists(path) && fs.lstatSync(getAbsolute(path)).isDirectory();

  if (!isFolder("")) {
    error(`Can't watch here: "${ folder }".`);
  }

  const defaultConfig = require(defaultConfigFile);
  const hasConfig = exists("gensist.json");
  const userConfig = hasConfig ? require(getAbsolute("gensist.json")) : {};
  const config = Object.assign(defaultConfig, userConfig);

  browserSync.init({ server: getAbsolute(config.output) });

  chokidar.watch(getAbsolute(config.input)).on("all", async () => {
    await build(folder);
    browserSync.reload("*")
  });
}

module.exports = watch;