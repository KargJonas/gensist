const chalk = require("chalk");
const boxen = require("boxen");
const wrap = require("word-wrap");

function box(message, color = "white") {
  return boxen(wrap(message,
    { width: process.stdout.columns - 10, indent: "" }),
    { padding: 1, borderColor: color });
}

function info(...message) {
  console.log("\n" + chalk.black(chalk.bgYellow("GENSIST INFO")) + ":");
  console.log(box(message.join("\n\n"), "yellow"));
}

function error(...message) {
  const err = new Error("\n" + box(message.join("\n\n"), "red"));
  err.name = chalk.black(chalk.bgRed("GENSIST ERROR"));

  throw err;
}

module.exports = { info, error };