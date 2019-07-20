const path = require("path");
const fs = require("fs");
const ncp = require("ncp");

const templateFolder = path.join(__dirname, "../template");

module.exports = function (folder) {
  const getAbsolute = (relativePath) => path.join(folder, relativePath);
  const exists = (path) => fs.existsSync(getAbsolute(path));
  const isFolder = (path) => exists(path) && fs.lstatSync(getAbsolute(path)).isDirectory();
  const join = path.join;
  const copyFromTemplate = (fileName, newFileName = fileName) => {
    console.log(`Generating "${ newFileName }"`);

    console.log("######")
    console.log({fileName,newFileName})

    ncp(join(templateFolder, fileName), getAbsolute(newFileName), (err) => {
      if (err) throw err;
    });
  }

  return { getAbsolute, exists, isFolder, join, copyFromTemplate };
}