/*jslint
    es6: true, node: true
*/
/*global
    describe, it, before, document
*/
"use strict";

const chai = require("chai");
const expect = chai.expect;
const jsdom = require("mocha-jsdom");

const jthf = require("../index");

let $;
jsdom();

describe("The json-to-html-form module", function () {

    it("should exist", function () {
        expect(jthf).to.be.an("object");
    });

    it("should have a 'getForm' method", function () {
        expect(jthf.getForm).to.be.a("function");
    });

    describe("The 'getForm' method", function () {
        before(function () {
            $ = require('jquery');
        });

        describe("The HTML (return value)", function () {

            it("should contain an empty form (html string) if no argument(s) were supplied", function () {
                let html = jthf.getForm();

                expect(html).to.equals("<form></form>");
            });

            it("should contain a <form> contaning and a 'root' fieldset if the (json, object) argument is '{}' (an object)", function () {
                let html = jthf.getForm({});

                expect(html).to.equals("<form><fieldset><legend>Root</legend></fieldset></form>");
            });

            it("should add a label with a span and an input[type='text'] to all key/value pairs (where the value is a string)", function () {
                let testJson = {
                    "string1": "one",
                    "string2": "two"
                };
                let html = jthf.getForm(testJson);

                document.body.innerHTML = html;

                let labels = $("fieldset label");

                let label1 = labels.eq(0);
                let span1 = label1.find("span");
                let inp1 = label1.find("input[type='text']");

                expect(span1.text()).to.equals("string1");
                expect(inp1.val()).to.equals("one");

                let label2 = labels.eq(1);
                let span2 = label2.find("span");
                let inp2 = label2.find("input[type='text']");

                expect(span2.text()).to.equals("string2");
                expect(inp2.val()).to.equals("two");
            });
        });
    });
});