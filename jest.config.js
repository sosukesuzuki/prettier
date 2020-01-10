"use strict";

const ENABLE_TEST_RESULTS = !!process.env.ENABLE_TEST_RESULTS;
const ENABLE_CODE_COVERAGE = !!process.env.ENABLE_CODE_COVERAGE;

module.exports = {
  setupFiles: ["<rootDir>/tests_config/run_spec.js"],
  snapshotSerializers: [
    "jest-snapshot-serializer-raw",
    "jest-snapshot-serializer-ansi"
  ],
  testRegex: "jsfmt\\.spec\\.js$|__tests__/.*\\.js$",
  testPathIgnorePatterns: ["tests/new_react", "tests/more_react"],
  collectCoverage: ENABLE_CODE_COVERAGE,
  collectCoverageFrom: ["src/**/*.js", "index.js", "!<rootDir>/node_modules/"],
  coveragePathIgnorePatterns: [
    "<rootDir>/standalone.js",
    "<rootDir>/src/doc/doc-debug.js",
    "<rootDir>/src/main/massage-ast.js"
  ],
  coverageReporters: ["text", "html", "cobertura"],
  moduleNameMapper: {
    // Jest wires `fs` to `graceful-fs`, which causes a memory leak when
    // `graceful-fs` does `require('fs')`.
    // Ref: https://github.com/facebook/jest/issues/2179#issuecomment-355231418
    // If this is removed, see also scripts/build/build.js.
    "graceful-fs": "<rootDir>/tests_config/fs.js",

    "prettier/local": "<rootDir>/tests_config/require_prettier.js",
    "prettier/standalone": "<rootDir>/tests_config/require_standalone.js"
  },
  testEnvironment: "node",
  transform: {},
  watchPlugins: [
    "jest-watch-typeahead/filename",
    "jest-watch-typeahead/testname"
  ],
  reporters: ["default"].concat(ENABLE_TEST_RESULTS ? "jest-junit" : [])
};
