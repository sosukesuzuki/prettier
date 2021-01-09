"use strict";

const workerpool = require("workerpool");
const { rollup } = require("rollup");
const {
  runWebpack,
  getWebpackConfig,
  getRollupConfig,
  getRollupOutputOptions,
} = require("./bundler");

async function createWebpackBundle(bundleConfig) {
  await runWebpack(getWebpackConfig(bundleConfig));
}

async function createRollupBundle(bundleConfig, options) {
  const inputOptions = getRollupConfig(bundleConfig);
  const outputOptions = getRollupOutputOptions(bundleConfig, options);
  const result = await rollup(inputOptions);
  await Promise.all(outputOptions.map((option) => result.write(option)));
}

workerpool.worker({
  createWebpackBundle,
  createRollupBundle,
});
