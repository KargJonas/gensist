const transform = require("../index");
// const mocha = require("mocha");
const chai = require("chai");
const rimraf = require("rimraf");
const fs = require("fs");

describe("transform", () => {
  const outputFolder = "test/output";
  const inputFolder = "test/input";

  it("should throw an error when no arguments are provided.", () => {
    chai.expect(() => {
      transform(); // No arguments
    }).to.throw("The input folder is invalid.");
  });

  it("should throw an error when provided an invalid input folder.", () => {
    chai.expect(() => {
      transform(
        "test/this-folder-does-not-exist", // Invalid folder
        outputFolder,
        ({ input }) => (input),
        true
      );
    }).to.throw("The input folder is invalid.");
  });

  it("should throw an error when provided an invalid convert-function.", () => {
    chai.expect(() => {
      transform(
        inputFolder,
        outputFolder,
        3.14159265, // invalid parameter
        true
      );
    }).to.throw("Invalid convert-function.");
  });

  it("should create a new output folder.", () => {
    rimraf.sync(outputFolder);

    transform(
      inputFolder,
      outputFolder,
      ({ input }) => ({ output: `Content of the input file: ${ input }` }),
      true
    );

    chai.assert.equal(fs.existsSync(outputFolder), true);
    chai.assert.equal(fs.lstatSync(outputFolder).isDirectory(), true);
  });

  it("should create a new output folder even if one exists.", () => {
    transform(
      inputFolder,
      outputFolder,
      ({ input }) => ({ output: `Content of the input file: ${ input }` }),
      true
    );

    chai.assert.equal(fs.existsSync(outputFolder), true);
    chai.assert.equal(fs.lstatSync(outputFolder).isDirectory(), true);
  });

  it("should work.", () => {
    transform(
      inputFolder,
      outputFolder,
      ({ content, name }) => ({
        output: `Content of the input file: ${ content }`,
        name: `${ name }.md`
      }),
      true
    );

    // Check if file exists
    chai.assert.equal(fs.existsSync(`${ outputFolder }/nested/very-important-file.txt.md`), true);

    // Check if file actually is a file
    chai.assert.equal(fs.lstatSync(`${ outputFolder }/nested/very-important-file.txt.md`).isFile(), true);

    // Getting the original file
    const original = fs.readFileSync(`${inputFolder}/nested/very-important-file.txt`);
    // Getting the converted file
    const content = fs.readFileSync(`${ outputFolder }/nested/very-important-file.txt.md`);
    // Comparing the two
    chai.assert.equal(content, `Content of the input file: ${ original }`);
  });
});