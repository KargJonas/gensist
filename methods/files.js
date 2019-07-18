module.exports = function (folder) {
  const getAbsolute = (relativePath) => path.join(folder, relativePath);
  const exists = (path) => fs.existsSync(getAbsolute(path));
  const isFolder = (path) => exists(path) && fs.lstatSync(getAbsolute(path)).isDirectory();

  return { getAbsolute, exists, isFolder };
}