/*jslint
    es6: true, node: true
*/
/*global
    describe, it
*/
"use strict";

const chai = require("chai");
const expect = chai.expect;

const jthf = require("../index");

describe("The json-to-html-form module", function () {
    it("should exist", function () {
        expect(jthf).to.be.an("object");
    });

    it("should have a 'getForm' method", function () {
        expect(jthf.getForm).to.be.a("function");
    });

    describe("The 'getForm' method", function () {
        it("should return an empty form (html string) if no argument(s) were supplied", function () {
            let html = jthf.getForm();

            expect(html).to.equals("<form></form>");
        });
    });
});