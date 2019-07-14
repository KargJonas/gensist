const transform = require("file-tree-transform");
const converter = require("./converters/default");
const path = require("path");
const ncp = require("ncp");
const fs = require("fs");
const chalk = require("chalk");
const boxen = require("boxen");
const wrap = require("word-wrap");

const templateFolder = path.join(__dirname, "template");
const defaultConfigFile = path.join(__dirname, "default-config.json");

function box(message, color = "white") {
  return boxen(wrap(message,
    { width: process.stdout.columns - 10, indent: "" }),
    { padding: 1, borderColor: color });
}

function info(...message) {
  console.log(chalk.black(chalk.bgYellow("GENSIST INFO")) + ":");
  console.log(box(message.join("\n\n"), "yellow"));
}

function error(...message) {
  const err = new Error("\n" + box(message.join("\n\n"), "red"));
  err.name = chalk.black(chalk.bgRed("GENSIST ERROR"));

  throw err;
}

function build(folder) {
  const getAbsolute = (relativePath) => path.join(folder, relativePath);
  const exists = (path) => fs.existsSync(getAbsolute(path));
  const isFolder = (path) => exists(path) && fs.lstatSync(getAbsolute(path)).isDirectory();

  if (!isFolder("")) {
    error(`Can't build here: "${ folder }".`);
  }

  const hasConfig = exists("gensist.json");
  // const config = hasConfig ? require()

  if (!hasTemplate) {
    info(
      "This folder is missing some configuration files.",
      `Run "gensist init" to add the missing configuration.`,
      "Falling back to defaults."
    );
  }

  const config

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

  // if (!isFolder("config")) {
  //   info(
  //     "This folder is missing a gensist configuration.",
  //     `Adding a basic config ...`
  //   );

  //   ncp(templateFolder + "/config", getAbsolute("config"), (err) => {
  //     if (err) throw err;
  //     console.log("Done.");
  //   });
  // } else {
  //   if (!exists("config/template.html")) {
  //     info(
  //       "This folder is missing a template",
  //       `Adding a basic template ...`
  //     );

  //     ncp(templateFolder + "/config/template.html", getAbsolute("config/template.html"), (err) => {
  //       if (err) throw err;
  //       console.log("Done.");
  //     });
  //   }
  // }
}

module.exports = build;