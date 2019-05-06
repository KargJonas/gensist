const fs = require("fs");
const path = require("path");
const ncp = require("ncp").ncp;

function create(name, location) {
  const projectDir = path.join(location, name);
  const templateDir = path.join(__dirname, "template");

  // Checking if the project folder is valid.
  if (fs.existsSync(projectDir)) {
    throw new Error(`Project-folder already exists: "${ projectDir }"`);
  }

  // Copy the template to the project directory.
  ncp(templateDir, projectDir, (err) => {
    if (err) throw err;
    console.log("Done.")
  });
}

module.exports = create;