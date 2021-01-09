const workerpool = require("workerpool");

function createBundle() {
  console.log("create bundle");
}

workerpool.worker({
  createBundle,
});
