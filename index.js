#!/usr/bin/env node

const cli = require("commander");
const version = require("./package.json").version;
const location = process.cwd();
const required = require.main !== module;

const create = require("./create");
const build = require("./build");
const init = require("./init");
const watch = require("./watch");

module.exports = { create, build, init, watch };

if (required) return;

if (process.argv.length <= 2) {
  build(location);
  return;
}

cli
  .version(version, "-v --version")

cli
  .command("build")
  .action(() => build(location))

cli
  .command("init")
  .action(() => init(location))

cli
  .command("watch")
  .action(() => watch(location))

cli
  .command("new <name>")
  .action((name) => create(name, location))

cli.parse(process.argv);