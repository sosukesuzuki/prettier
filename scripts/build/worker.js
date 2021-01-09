const workerpool = require("workerpool");
const { rollup } = require("rollup");
const { runWebpack, getWebpackConfig } = require("./bundler");

async function createWebpackBundle(bundleConfig) {
  await runWebpack(getWebpackConfig(bundleConfig));
}

async function createRollupBundle(inputOptions, outputOptions) {
  const result = await rollup(inputOptions);
  await Promise.all(outputOptions.map((option) => result.write(option)));
}

workerpool.worker({
  createWebpackBundle,
  createRollupBundle,
});
