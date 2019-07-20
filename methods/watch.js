const chokidar = require("chokidar");
const browserSync = require("browser-sync").create();
const files = require("./files");
const getConfig = require("./get-config");
const build = require("./build");

function watch(folder) {
  const { getAbsolute, exists, isFolder } = files(folder);
  const { config } = getConfig(folder);

  if (!isFolder("")) {
    error(`Can't watch here: "${ folder }".`);
  }

  browserSync.init({ server: getAbsolute(config.output) });

  chokidar.watch(getAbsolute(config.input)).on("all", async () => {
    await build(folder);
    browserSync.reload("*")
  });
}

module.exports = watch;