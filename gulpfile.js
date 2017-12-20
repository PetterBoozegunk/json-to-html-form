/*jslint es6: true, node: true*/

"use strict";

const allJsFiles = [
	"*.js",
	"test/**/*.js",
	"!gulpfile.js"
];

const cccp = require("gulp-cccp");
const cccpConfig = {
	"checkFixSrc": allJsFiles,
	"complexityCheck": allJsFiles,
	"prettify": {
		"jslint_happy": true,
		"end_with_newline": true,
		"keep_array_indentation": true,
		"preserve_newlines": true
	},
	"jslint": {
		"white": true,
		"single": false,
		"this": true
	},
	"plato": {
		dir: "platoReport",
		options: {
			esversion: 6
		}
	}
};

cccp(cccpConfig);