const transform = require("../index");

const inputFolder = "input-folder";
const outputFolder = "output-folder";
const convertInputToString = true;

function convertFileFunc({
  input,  // Content of the original file
  name    // Filename of the original file
}) {
  const newContent = `This is a modified file.\n${input}`;
  const newName = `${name}.converted`;

  return {
    output: newContent, // Content of the new file
    name: newName       // Filename of the new file (optional)
  };
}

transform(
  inputFolder,
  outputFolder,
  convertFileFunc,
  convertInputToString // optional - default: true
);