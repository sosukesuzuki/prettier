"use strict";

const runPretter = require("../runPrettier");

describe("format unsupported file whose parser is overridden when a file is specified for glob", () => {
  runPretter("cli/override-unsupported-files", [
    "./folder/foo.overridden-as-js",
  ]).test({
    status: 0,
    stderr: "",
    stdout:
      "function helloWorld() {\n" + '  console.log("Hello, World");\n' + "}\n",
  });
});

describe("format unsupported file whose parser is overridden when a directory is specified for glob", () => {
  runPretter("cli/override-unsupported-files", ["folder"]).test({
    status: 0,
    stderr: "",
    stdout:
      "function helloWorld() {\n" + '  console.log("Hello, World");\n' + "}\n",
  });
});

describe("format unsupported file whose parser is overridden when a file is specified for glob with ignore-unknown", () => {
  runPretter("cli/override-unsupported-files", [
    "--ignore-unknown",
    "./folder/foo.overridden-as-js",
  ]).test({
    status: 0,
    stderr: "",
    stdout:
      "function helloWorld() {\n" + '  console.log("Hello, World");\n' + "}\n",
  });
});

describe("format unsupported file whose parser is overridden when a directory is specified for glob with ignore-unknown", () => {
  runPretter("cli/override-unsupported-files", [
    "--ignore-unknown",
    "folder",
  ]).test({
    status: 0,
    stderr: "",
    stdout:
      "function helloWorld() {\n" + '  console.log("Hello, World");\n' + "}\n",
  });
});
