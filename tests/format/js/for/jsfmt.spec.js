run_spec(__dirname, ["babel", "flow", "typescript"], {
  errors: { flow: ["let[-expression.js"] },
});
