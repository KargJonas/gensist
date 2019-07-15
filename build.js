const transform = require("file-tree-transform");
const path = require("path");
const fs = require("fs");
const ncp = require("ncp");
const { info, error } = require("./info");

const markdown = require("./converters/markdown");
const insert = require("./converters/insert");
const minifyHtml = require("./converters/minifyHtml");
const minifyCss = require("./converters/minifyCss");

const templateFolder = path.join(__dirname, "template");
const defaultConfigFile = path.join(__dirname, "default-config.json");

function readFileAsync(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

async function build(folder) {
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
      `No input folder "${ config.input }/" found!`,
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

  const htmlOptimizer = config.optimize ? minifyHtml : $ => $;
  const cssOptimizer = config.optimize ? minifyCss : $ => $;

  const template = load(hasTemplate
    ? getAbsolute(config.template)
    : path.join(templateFolder, "template.html"));

  const inputDir = getAbsolute(config.input);
  const outputDir = getAbsolute(config.output);

  let style = false;

  if (config.style) {
    if (!(config.style instanceof Array)) {
      error(`The "style"-property in gensist.json must be an array!`);
    }

    if (!config.style.length) return;

    if (config.style.filter((item) => typeof item === "string").length !== config.style.length) {
      error(`The style array in gensist.json may only contain strings!`);
    }

    style = true;
  }

  transform(inputDir, outputDir, ({ input, name }) => {
    const cleanFileName = name.slice(0, name.lastIndexOf(".")) || name;

    const data = {
      title: config.title,
      page: cleanFileName,
      content: markdown(input),
      style: style ? `<link rel="stylesheet"href="style.css"></link>` : ""
    };

    return {
      output: htmlOptimizer(insert(template, data)),
      name: `${ cleanFileName }.html`
    };
  });

  if (style) {
    const loadedStyles = await Promise.all(config.style.map(readFileAsync))
      .catch((e) => {
        console.error(e);
        error(`BUILD FAILED\nCould not load style file${ e.path ? `\n\n${ e.path }` : "" }`);
      });

    fs.writeFileSync(
      path.join(outputDir, "style.css"),
      await cssOptimizer(loadedStyles.join("\n")),
      (err) => { if (err) throw err }
    );
  }

  if (typeof config.assets === "string" && exists(config.assets)) {
    ncp(getAbsolute(config.assets), path.join(getAbsolute("build"), "assets"), (err) => {
      if (err) throw err;
    });
  }

  info("Built successfully!");
}

module.exports = build;