const transform = require("file-tree-transform");
// const converter = require("./converters/default");
const path = require("path");
const fs = require("fs");
const ncp = require("ncp");
const { info, error } = require("./info");

const markdown = require("./converters/markdown");
const insert = require("./converters/insert");
const minify = require("./converters/minify");

const templateFolder = path.join(__dirname, "template");
const defaultConfigFile = path.join(__dirname, "default-config.json");

function build(folder) {
  const getAbsolute = (relativePath) => path.join(folder, relativePath);
  const exists = (path) => fs.existsSync(getAbsolute(path));
  const isFolder = (path) => exists(path) && fs.lstatSync(getAbsolute(path)).isDirectory();
  const load = (path) => fs.readFileSync(path).toString();

  if (!isFolder("")) {
    error(`Can't build here: "${ folder }".`);
  }

  const defaultConfig = require(defaultConfigFile);
  const hasConfig = exists("gensist.json");
  const userConfig = hasConfig ? require(getAbsolute("gensist.json")) : {};
  const config = Object.assign(defaultConfig, userConfig);
  const hasTemplate = exists(config.template);

  if (!exists(config.input)) {
    error(
      `No input folder "${config.input}/" found!`,
      `You can set the input folder in "gensist.json".`,
      `(relative to the project folder)`
    );
  }

  if (!hasConfig) {
    info(
      `This folder is missing a config (gensist.json).`,
      `Run "gensist init" to add generate one.`,
      "Falling back to defaults."
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

  transform(inputDir, outputDir, ({ input, name }) => {
    const cleanFileName = name.slice(0, name.lastIndexOf(".")) || name;

    const data = {
      title: config.title,
      page: cleanFileName,
      content: markdown(input)
    };

    return {
      output: minify(insert(template, input, data)),
      name: `${ cleanFileName }.html`
    };
  });

  if (typeof config.assets === "string" && exists(config.assets)) {
    ncp(getAbsolute(config.assets), path.join(getAbsolute("build"), "assets"), (err) => {
      if (err) throw err;
    });
  }
}

module.exports = build;