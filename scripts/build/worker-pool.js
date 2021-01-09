const path = require("path");
const workerpool = require("workerpool");

const WORKER_PATH = path.join(__dirname, "./worker.js");

module.exports = class WorkerPool {
  constructor() {
    this._pool = workerpool.pool(WORKER_PATH);
  }
};
