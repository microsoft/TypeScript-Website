var remark = require("remark")
var visit = require("unist-util-visit")

const { readFileSync }= require("fs")

var remark = require("remark")
var visit = require("unist-util-visit")
var {visitor} = require("../")

var tree = remark().parse(readFileSync(__dirname + "/index.md", "utf8"))
visit(tree, "code", visitor)
console.log(tree)
