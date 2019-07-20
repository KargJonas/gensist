const transform = require("file-tree-transform");
const path = require("path");
const fs = require("fs");
const ncp = require("ncp");
const { info, error } = require("./info");
const files = require("./files");
const getConfig = require("./get-config");

const markdown = require("../converters/markdown");
const insert = require("../converters/insert");
const minifyHtml = require("../converters/minifyHtml");
const minifyCss = require("../converters/minifyCss");

function readFileAsync(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
};

async function build(folder) {
  const { getAbsolute } = files(folder);
  const { config, meta } = getConfig(folder);
  const load = (_path) => fs.readFileSync(_path).toString();

  if (!meta.hasInput) {
    error(
      `No input folder "${ config.input }/" found!`,
      `You can set the input folder in "gensist.json".`,
      `(relative to the project folder)`
    );
  }

  if (!meta.hasConfig) {
    info(
      `This folder is missing a config (gensist.json).`,
      `Run "gensist init" to add generate one.`,
      "Falling back to defaults."
    );
  }

  if (!meta.hasTemplate) {
    info(
      "This folder is missing a template file.",
      `Run "gensist init" to generate one.`,
      "Falling back to defaults."
    );
  }

  const htmlOptimizer = config.optimize ? minifyHtml : $ => $;
  const cssOptimizer = config.optimize ? minifyCss : $ => $;
  const template = load(config.template);
  const inputDir = getAbsolute(config.input);
  const outputDir = getAbsolute(config.output);

  transform(inputDir, outputDir, ({ input, name }) => {
    const cleanFileName = name.slice(0, name.lastIndexOf(".")) || name;

    const data = {
      title: config.title,
      page: cleanFileName,
      content: markdown(input),
      style: meta.hasStyle ? `<link rel="stylesheet"href="style.css"></link>` : ""
    };

    return {
      output: htmlOptimizer(insert(template, data)),
      name: `${ cleanFileName }.html`
    };
  });

  if (meta.hasStyle) {
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

  if (meta.hasAssets) {
    ncp(getAbsolute(config.assets), path.join(getAbsolute("build"), "assets"), (err) => {
      if (err) throw err;
    });
  }

  info("Built successfully!");
  return 0;
}

module.exports = build;