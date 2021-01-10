"use strict";

const { printDanglingComments } = require("../../main/comments");
const {
  builders: { concat, join, line, hardline, softline, group, indent, ifBreak },
} = require("../../document");
const {
  isTestCall,
  hasComment,
  CommentCheckFlags,
  isTSXFile,
  shouldPrintComma,
  getFunctionParameters,
} = require("../utils");
const { shouldHugType } = require("./type-annotation");

const typeParametersGroupIds = new WeakMap();
function getTypeParametersGroupId(node) {
  if (!typeParametersGroupIds.has(node)) {
    typeParametersGroupIds.set(node, Symbol("typeParameters"));
  }
  return typeParametersGroupIds.get(node);
}

function printTypeParameters(path, options, print, paramsKey) {
  const n = path.getValue();
  const typeParameters = n[paramsKey];

  if (!typeParameters) {
    return "";
  }

  // for TypeParameterDeclaration typeParameters is a single node
  if (!Array.isArray(typeParameters)) {
    return path.call(print, paramsKey);
  }

  const grandparent = path.getNode(2);
  const isParameterInTestCall = grandparent != null && isTestCall(grandparent);

  const shouldInline =
    isParameterInTestCall ||
    typeParameters.length === 0 ||
    (typeParameters.length === 1 &&
      (shouldHugType(typeParameters[0]) ||
        (typeParameters[0].type === "GenericTypeAnnotation" &&
          shouldHugType(typeParameters[0].id)) ||
        (typeParameters[0].type === "TSTypeReference" &&
          shouldHugType(typeParameters[0].typeName)) ||
        typeParameters[0].type === "NullableTypeAnnotation"));

  if (shouldInline) {
    return concat([
      "<",
      join(", ", path.map(print, paramsKey)),
      printDanglingCommentsForInline(path, options),
      ">",
    ]);
  }

  return group(
    concat([
      "<",
      indent(
        concat([
          softline,
          join(concat([",", line]), path.map(print, paramsKey)),
        ])
      ),
      ifBreak(
        options.parser !== "typescript" &&
          options.parser !== "babel-ts" &&
          shouldPrintComma(options, "all")
          ? ","
          : ""
      ),
      softline,
      ">",
    ]),
    { id: getTypeParametersGroupId(n) }
  );
}

function printDanglingCommentsForInline(path, options) {
  const n = path.getValue();
  if (!hasComment(n, CommentCheckFlags.Dangling)) {
    return "";
  }
  const hasOnlyBlockComments = !hasComment(n, CommentCheckFlags.Line);
  const printed = printDanglingComments(
    path,
    options,
    /* sameIndent */ hasOnlyBlockComments
  );
  if (hasOnlyBlockComments) {
    return printed;
  }
  return concat([printed, hardline]);
}

function printTypeParameter(path, options, print) {
  const n = path.getValue();
  const parts = [];
  const parent = path.getParentNode();
  if (parent.type === "TSMappedType") {
    parts.push("[", path.call(print, "name"));
    if (n.constraint) {
      parts.push(" in ", path.call(print, "constraint"));
    }
    if (parent.nameType) {
      parts.push(
        " as ",
        path.callParent((path) => path.call(print, "nameType"))
      );
    }
    parts.push("]");
    return concat(parts);
  }

  if (n.variance) {
    parts.push(path.call(print, "variance"));
  }

  parts.push(path.call(print, "name"));

  if (n.bound) {
    parts.push(": ");
    parts.push(path.call(print, "bound"));
  }

  if (n.constraint) {
    parts.push(" extends ", path.call(print, "constraint"));
  }

  if (n.default) {
    parts.push(" = ", path.call(print, "default"));
  }

  // Keep comma if the file extension is .tsx and
  // has one type parameter that isn't extend with any types.
  // Because, otherwise formatted result will be invalid as tsx.
  const grandParent = path.getNode(2);
  if (
    getFunctionParameters(parent).length === 1 &&
    isTSXFile(options) &&
    !n.constraint &&
    grandParent.type === "ArrowFunctionExpression"
  ) {
    parts.push(",");
  }

  return concat(parts);
}

module.exports = {
  printTypeParameter,
  printTypeParameters,
  getTypeParametersGroupId,
};
