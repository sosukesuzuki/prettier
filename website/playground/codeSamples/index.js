import javascript from "./javascript.txt";
import flow from "./flow.txt";
import typescript from "./typescript.txt";
import css from "./css.txt";
import scss from "./scss.txt";
import less from "./less.txt";
import json from "./json.txt";
import graphql from "./graphql.txt";
import markdown from "./markdown.txt";
import mdx from "./mdx.txt";
import vue from "./vue.txt";
import yaml from "./yaml.txt";
import glimmer from "./glimmer.txt";
import html from "./html.txt";

export default function (parser) {
  switch (parser) {
    case "babel":
    case "espree":
    case "meriyah":
      return javascript;
    case "flow":
    case "babel-flow":
      return flow;
    case "typescript":
    case "babel-ts":
      return typescript;
    case "css":
      // Excerpted from the Bootstrap source, which is licensed under the MIT license:
      // https://github.com/twbs/bootstrap/blob/v4.0.0-beta.3/LICENSE
      return css;
    case "scss":
      // Excerpted from the Bootstrap source, which is licensed under the MIT license:
      // https://github.com/twbs/bootstrap/blob/v4.0.0-beta.3/LICENSE
      return scss;
    case "less":
      // Copied from http://lesscss.org/features/#detached-rulesets-feature
      return less;
    case "json":
    case "json5":
    case "json-stringify":
      // Excerpted & adapted from Wikipedia, under the Creative Commons Attribution-ShareAlike License
      // https://en.wikipedia.org/wiki/JSON#Example
      return json;
    case "graphql":
      return graphql;
    case "markdown":
      return markdown;
    case "mdx":
      // modified from https://github.com/mdx-js/mdx/blob/master/packages/mdx/test/fixtures/blog-post.md
      return mdx;
    case "vue":
      return vue;
    case "yaml":
      // modified from http://yaml.org/start.html
      return yaml;
    case "glimmer":
      // modified from http://handlebarsjs.com/
      return glimmer;
    case "html":
    case "angular":
    case "lwc":
      return html;
    default:
      return "";
  }
}
