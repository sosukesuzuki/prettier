"use strict";

const path = require("path");
const { EventEmitter } = require("events");
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
    this._emitter = new EventEmitter();
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
    try {
      const inputOptions = getRollupConfig(bundleConfig);
      const outputOptions = getRollupOutputOptions(bundleConfig, options);

      const status = {
        skipped: !Array.isArray(outputOptions) && outputOptions.skipped,
        cached: false,
      };

      if (!status.skipped && !options["purge-cache"]) {
        status.cached = (
          await Promise.all(
            outputOptions.map((outputOption) =>
              checkCache(bundleCache, inputOptions, outputOption)
            )
          )
        ).every((r) => r === true);
      }

      if (!status.cached) {
        console.log("Start bundling: " + bundleConfig.output);
        if (bundleConfig.bundler === "webpack") {
          await this._pool.exec("createWebpackBundle", [bundleConfig]);
        } else {
          await this._pool.exec("createRollupBundle", [bundleConfig, options]);
        }
      }

      console.log("End building: " + bundleConfig.output);
      if (bundleConfig.output === "parser-postcss.js") {
        this._emitter.emit("finish-postcss-bundle");
      }
    } catch (error) {
      if (
        error.code === "UNRESOLVED_ENTRY" &&
        bundleConfig.output === "esm/parser-postcss.mjs"
      ) {
        return new Promise((resolve) => {
          this._emitter.once("finish-postcss-bundle", async () => {
            console.log("Start bundling: " + bundleConfig.output);
            await this._pool.exec("createRollupBundle", [
              bundleConfig,
              options,
            ]);
            console.log("End building: " + bundleConfig.output);
            resolve();
          });
        });
      }
      throw error;
    }
  }
};
