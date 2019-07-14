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
  const load = (path) => fs.readFileSync(path).toString();

  if (!isFolder("")) {
    error(`Can't build here: "${ folder }".`);
  }

  const hasConfig = exists("gensist.json");

  if (!hasConfig) {
    info(
      `This folder is missing a config (gensist.json).`,
      `Run "gensist init" to add generate one.`,
      "Falling back to defaults."
    );
  }

  const defaultConfig = require(defaultConfigFile);
  const userConfig = hasConfig ? require(getAbsolute("gensist.json")) : {};
  const config = Object.assign(defaultConfig, userConfig);
  const hasTemplate = exists(config.template);
  const hasInputFolder = exists(config.input);

  if (!hasInputFolder) {
    error(
      `No input folder "${config.input}" found!`,
      `You can set the input folder in "gensist.json". It is relative to the project folder.`
    );
  }

  if (!hasTemplate) {
    info(
      "This folder is missing a template file.",
      `Run "gensist init" to generate one.`,
      "Falling back to defaults."
    );
  }

  const template = load(hasTemplate
    ? getAbsolute(config.template)
    : path.join(templateFolder, "template.html"));

  const inputDir = getAbsolute(config.input);
  const outputDir = getAbsolute(config.output);

  transform(inputDir, outputDir, ({ input, name }) => ({
    output: converter(template, input),
    name: `${ name.slice(0, name.length - 3) }.html`
  }));

  const hasAssetsFolder = exists(config.assets);

  if (hasAssetsFolder) {
    ncp(getAbsolute(config.assets), path.join(outputDir, "assets"), (err) => {
      if (err) throw err;
    });
  }
}

module.exports = build;