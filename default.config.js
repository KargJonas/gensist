const fs = require("fs");
const path = require("path");
const mustache = require("mustache").render;
const minify = require("html-minifier").minify;
const transform = require("file-tree-transform");
const showdown = require("showdown");
const ncp = require("ncp").ncp;

const converter = new showdown.Converter({
  "noHeaderId": true,
  parseImgDimensions: true
});

const minifyConf = {
  minifyCSS: true,
  minifyJS: true,
  collapseWhitespace: true,
};

const load = (path) => fs.readFileSync(path).toString();
const container = load("content/template.html");

function convertToPage({ content, name }) {
  // Skipping files that are not markdown.
  if (!name.endsWith(".md")) return;

  const view = {
    title: "Thomas Karg",
    content: converter.makeHtml(content),
    name,
    shortTitle: name[0].toUpperCase() + name.slice(1, name.length - 3)
  };

  const newContent = minify(
    mustache(container, view),
    minifyConf
  );

  const newName = `${ name.slice(0, name.length - 3) }.html`;

  return {
    content: newContent,
    name: newName
  }
}

function build(location) {
  const contentDir = path.join(location, "content");
  const buildDir = path.join(location, "build");
  transform(contentDir, buildDir, convertToPage);
  ncp();
}

module.exports = build;