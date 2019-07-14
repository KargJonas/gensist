#!/usr/bin/env node

const cli = require("commander");
const version = require("./package.json").version;
const location = process.cwd();

const create = require("./create");
const build = require("./build");

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
  .command("new <name>")
  .action((name) => create(name, location))

cli.parse(process.argv);