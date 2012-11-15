var cssom = require("cssom")
var escodegen = require("escodegen")
var slice = Array.prototype.slice

module.exports = function(css) {
  var css_ast = cssom.parse(css)
  var rules = css_ast.cssRules.map(function(rule) {
    var program = {type: "Program", body: [CSSStyleRule(rule)]}

    var js = escodegen.generate(program, {
      format: {
        quotes: "auto",
        semicolons: false,
        indent: {style: "  ", base: 1}
      }
    })

    return js
  })

  return (
    "var STYLE = require('domo').STYLE;\n\n" +
    "module.exports =\n\n" +
    "STYLE({ type: 'text/css' },\n" +
    rules.join(",\n\n") +
    "\n);"
  )
}

function CSSStyleRule(ast) {
  var selector = ast
    .selectorText
    .split(",")
    .map(function(text) {
      return {type: "Literal", value: text.trim()}
    })

  selector = selector.length > 1
    ? {type: "ArrayExpression", elements: selector}
    : selector[0]

  return {
    type: "ExpressionStatement",
    expression: {
      type: "CallExpression",

      callee: {
        type: "MemberExpression",
        computed: false,
        object: {type: "Identifier", name: "STYLE"},
        property: {type: "Identifier", name: "on"}
      },

      arguments: [
        selector,
        CSSStyleDeclaration(ast.style)
      ]
    }
  }
}

function CSSStyleDeclaration(ast) {
  return {
    type: "ObjectExpression",
    properties: slice.call(ast).map(function(name) {
      return {
        type: "Property",
        key: CSSStyleDeclarationName(name),
        value: CSSStyleDeclarationValue(ast[name])
      }
    })
  }
}

function CSSStyleDeclarationName(name) {
  name = name.replace(/-\w/g, function(str) {
    return str[1].toUpperCase()
  })

  return {type: "Identifier", name: name}
}

function CSSStyleDeclarationValue(value) {
  var pixels = value.replace(/px$/, "")

  value = {type: "Literal", value: value}

  if (isNaN(pixels)) return value

  value.value = Number(pixels)

  if (pixels < 0) {
    value.value = -value.value
    value = {
      type: "UnaryExpression",
      operator: "-",
      argument: value
    }
  }

  return value
}
