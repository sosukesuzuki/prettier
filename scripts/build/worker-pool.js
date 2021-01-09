const path = require("path");
const workerpool = require("workerpool");
const {
  getRollupConfig,
  getRollupOutputOptions,
  checkCache,
} = require("./bundler");

const WORKER_PATH = path.join(__dirname, "./worker.js");

module.exports = class WorkerPool {
  constructor() {
    this._pool = workerpool.pool(WORKER_PATH, { workerType: "process" });
  }

  terminate() {
    this._pool.terminate();
  }

  /**
   * @param {import("./config").Bundle} bundleConfig
   * @param {import("./cache")} bundleCache
   * @param {any} options
   */
  async createBundle(bundleConfig, bundleCache, options) {
    console.log("Start bundling: " + bundleConfig.output);

    try {
      const inputOptions = getRollupConfig(bundleConfig);
      const outputOptions = getRollupOutputOptions(bundleConfig, options);

      const status = {
        skipped: !Array.isArray(outputOptions) && outputOptions.skipped,
        cached: false,
        bundled: false,
      };

      if (!status.skipped) {
        status.cached = (
          await Promise.all(
            outputOptions.map((outputOption) =>
              checkCache(bundleCache, inputOptions, outputOption)
            )
          )
        ).every((r) => r === true);
      }

      if (!status.cached) {
        if (bundleConfig.bundler === "webpack") {
          await this._pool.exec("createWebpackBundle", [bundleConfig]);
        } else {
          // await this._pool.exec("createRollupBundle", [
          //   inputOptions,
          //   outputOptions,
          // ]);
        }
        status.bundled = true;
      }

      console.log("End building: " + bundleConfig.output);
    } catch (error) {
      throw error;
    }
  }
};
