## USAGE:
A tool for walking through file a file tree and modifying it's files.

```js
const transform = require("transform");

const inputFolder = "path/to/my/input-folder";
const outputFolder = "path/to/my/output-folder";
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
```

> See /example