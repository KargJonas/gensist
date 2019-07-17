const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;
const { info, error } = require("./info");

function create(name, location) {
  const projectDir = path.join(location, name);
  const templateDir = path.join(__dirname, "template");

  // Checking if the project folder is valid.
  if (fs.existsSync(projectDir)) {
    error(`Project-folder already exists:\n"${ projectDir }"`);
  }

  // Copy the template to the project directory.
  ncp(templateDir, projectDir, (err) => {
    if (err) throw err;
    info(`Project successfully generated!`);
  });
}

module.exports = create;