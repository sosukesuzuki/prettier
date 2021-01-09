const workerpool = require("workerpool");
const { rollup } = require("rollup");
const { runWebpack } = require("./bundler");

async function createWebpackBundle(webpackConfig) {
  await runWebpack(webpackConfig);
}

async function createRollupBundle(inputOptions, outputOptions) {
  const result = await rollup(inputOptions);
  await Promise.all(outputOptions.map((option) => result.write(option)));
}

workerpool.worker({
  createWebpackBundle,
  createRollupBundle,
});
