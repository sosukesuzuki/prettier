"use strict";

const { isNumericLiteral } = require("../utils");

const {
  builders: { concat, softline, group, indent },
} = require("../../document");

/**
 * @typedef {import("../../common/fast-path").FastPathObject} FastPathObject
 */

/**
 * @param {FastPathObject} path
 */
function printOptionalToken(path) {
  const node = path.getValue();
  if (
    !node.optional ||
    // It's an optional computed method parsed by typescript-estree.
    // "?" is printed in `printMethod`.
    (node.type === "Identifier" && node === path.getParentNode().key)
  ) {
    return "";
  }
  if (
    node.type === "OptionalCallExpression" ||
    (node.type === "OptionalMemberExpression" && node.computed)
  ) {
    return "?.";
  }
  return "?";
}

/**
 * @param {FastPathObject} path 
 * @param {Object} options 
 * @param {Function} print 
 */
function printFunctionTypeParameters(path, options, print) {
  const fun = path.getValue();
  if (fun.typeArguments) {
    return path.call(print, "typeArguments");
  }
  if (fun.typeParameters) {
    return path.call(print, "typeParameters");
  }
  return "";
}

/**
 * @param {FastPathObject} path 
 * @param {Object} options 
 * @param {Function} print 
 */
function printMemberLookup(path, options, print) {
  const property = path.call(print, "property");
  const n = path.getValue();
  const optional = printOptionalToken(path);

  if (!n.computed) {
    return concat([optional, ".", property]);
  }

  if (!n.property || isNumericLiteral(n.property)) {
    return concat([optional, "[", property, "]"]);
  }

  return group(
    concat([optional, "[", indent(concat([softline, property])), softline, "]"])
  );
}

/**
 * @param {FastPathObject} path 
 * @param {Object} options 
 * @param {Function} print 
 */
function printBindExpressionCallee(path, options, print) {
  return concat(["::", path.call(print, "callee")]);
}

module.exports = {
  printOptionalToken,
  printFunctionTypeParameters,
  printMemberLookup,
  printBindExpressionCallee,
};
