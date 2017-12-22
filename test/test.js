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

                expect(html).to.equals("<form><fieldset class=\"object\"><legend>root</legend></fieldset></form>");
            });

            describe("Simple key/values", function () {
                describe("Value is a string", function () {
                    it("should add a label with a span and an input[type='text'] to all key/value pairs", function () {
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
                describe("Value is a number", function () {
                    it("should add an input[type='text'][value='1']", function () {
                        let testJson = {
                            "string1": 1
                        };
                        let html = jthf.getForm(testJson);

                        document.body.innerHTML = html;

                        let numberValInput = $("fieldset label input[type='text'][value='1']");

                        expect(numberValInput.length > 0).to.equals(true);
                    });
                });
                describe("Value is null", function () {
                    it("should add an input[type='text'][value='null']", function () {
                        let testJson = {
                            "string1": null
                        };
                        let html = jthf.getForm(testJson);

                        document.body.innerHTML = html;

                        let nullValInput = $("fieldset label input[type='text'][value='null']");

                        expect(nullValInput.length > 0).to.equals(true);
                    });
                });
                describe("Value is a boolean", function () {
                    it("should add an input[type='text'][value='true']", function () {
                        let testJson = {
                            "string1": true
                        };
                        let html = jthf.getForm(testJson);

                        document.body.innerHTML = html;

                        let boolValInput = $("fieldset label input[type='text'][value='true']");

                        expect(boolValInput.length > 0).to.equals(true);
                    });
                });

                it("should render a <textarea> if the value is 30 chars or more", function () {
                    let testJson = {
                        "longString": "This is a string that has more then 30 chars in it. You bet ya buddiy!!"
                    };
                    let html = jthf.getForm(testJson);

                    document.body.innerHTML = html;

                    let txtarea = $("fieldset textarea[name='longString']");

                    expect(txtarea.length).to.equals(1);
                });
            });

            describe("When the value (in key/value) is an object", function () {
                it("should add a fieldset.object and label/span/input for all simple key/values in that object", function () {
                    let testJson = {
                        "obj1": {
                            "obj1Str": "yay",
                            "obj1Bool": true
                        }
                    };
                    let html = jthf.getForm(testJson);

                    document.body.innerHTML = html;

                    let fsObjectTest = $("fieldset.object > fieldset.object > label");

                    expect(fsObjectTest.eq(0).find("span").text()).to.equals("obj1Str");
                    expect(fsObjectTest.eq(0).find("input[type='text']").val()).to.equals("yay");

                    expect(fsObjectTest.eq(1).find("input[type='text']").val()).to.equals("true");
                });
            });

            describe("When the value (in key/value) is an array", function () {
                it("should add a fieldset.array and label/span/input for all object containing simple key/values in that array", function () {
                    let testJson = {
                        "array1": [{
                            "name": "yo"
                        }, {
                            "name": "yay"
                        }]
                    };
                    let html = jthf.getForm(testJson);

                    document.body.innerHTML = html;

                    let arrObjectTest = $("fieldset.object > fieldset.array > legend + ul > li > label");

                    expect(arrObjectTest.length).to.equals(2);
                    expect(arrObjectTest.find("input[type='text'][value='yay']").length).to.equals(1);
                });
            });

            describe("When the json object is nested", function () {
                it("should also work...", function () {
                    let testJson = {
                        "str": "Marky",
                        "array2": [{
                            "name": "Joey"
                        }, {
                            "name": "Dee Dee"
                        }],
                        "obj": {
                            "array3": [{
                                "txt": "deeply nested"
                            }]
                        }
                    };
                    let html = jthf.getForm(testJson);

                    document.body.innerHTML = html;

                    let test1 = $("fieldset.object > label input[value='Marky']");
                    let test2 = $("fieldset.object > fieldset.array > ul > li > label > input[value='Joey']");
                    let test3 = $("fieldset.object > fieldset.object > .array > ul > li > label > input[value='deeply nested']");

                    expect(test1.length).to.equals(1);
                    expect(test2.length).to.equals(1);
                    expect(test3.length).to.equals(1);
                });
            });

            describe("form element name attribute", function () {
                describe("A simple root property", function () {
                    it("should get it's key (name) as the name attribute", function () {
                        let testJson = {
                            "level-1": "one"
                        };
                        let html = jthf.getForm(testJson);

                        document.body.innerHTML = html;

                        let textInput = $("form > fieldset > label > input[type='text'][value='one'][name='level-1']");

                        expect(textInput.length).to.equals(1);
                    });
                });
                describe("A nested property", function () {
                    it("should get all it's parents key (names) as well as it's own key (name) as it's name attribute", function () {
                        let testJson = {
                            "level-1": {
                                "level-2": "yay"
                            }
                        };
                        let html = jthf.getForm(testJson);

                        document.body.innerHTML = html;

                        let textInput = $("input[type='text'][value='yay'][name='level-1.level-2']");

                        expect(textInput.length).to.equals(1);
                    });
                });
                describe("The name attribute in arrays", function () {
                    it("should get the arrayName.index.propertyName as it's name attribute. ex: array1.0.name", function () {
                        let testJson = {
                            "level-1": {
                                "level-2-array": [{
                                    "name": "Glenn Danzig"
                                }]
                            }
                        };
                        let html = jthf.getForm(testJson);

                        document.body.innerHTML = html;

                        let textInput = $("input[type='text'][value='Glenn Danzig'][name='level-1.level-2-array.0.name']");

                        expect(textInput.length).to.equals(1);
                    });
                });
            });
        });

        describe("The options object", function () {
            describe("The noForm option", function () {
                it("shoulde be possible to set 'noForm' to false to skip the wrapping <form> tag", function () {
                    let testJson = {
                        "options": "test"
                    };
                    let options = {
                        noForm: true
                    };
                    let html = jthf.getForm(testJson, options);

                    document.body.innerHTML = html;

                    let form = $("form");
                    let fieldset = $("fieldset");

                    expect(form.length).to.equals(0);
                    expect(fieldset.length).to.equals(1);
                });
            });

            describe("The htmlBeforeObject option", function () {
                it("should be possible to add a html string after each legend in a fieldset", function () {
                    let testJson = {
                        "options": "test",
                        "nestedTest": {
                            "name": "val"
                        }
                    };
                    let options = {
                        htmlBeforeObject: "<p class='htmlBeforeObject'>htmlBeforeObject</p>"
                    };
                    let html = jthf.getForm(testJson, options);

                    document.body.innerHTML = html;

                    let test1 = $("form > fieldset.object > legend + .htmlBeforeObject");
                    let test2 = $("form > fieldset.object > fieldset.object > legend + .htmlBeforeObject");

                    expect(test1.length).to.equals(1);
                    expect(test2.length).to.equals(1);
                });

                describe("If the htmlBeforeObject option is a function", function () {
                    it("should get 'key' and 'parentKey' arguments", function () {
                        let testJson = {
                            "one": "test",
                            "two": {
                                "three": {
                                    "four": {
                                        "five": "yay"
                                    }
                                }
                            }
                        };
                        let options = {
                            htmlBeforeObject: function (key, parentKey) {
                                return "<div data-key=\"" + key + "\" data-parentKey=\"" + parentKey + "\">htmlBeforeObject</div>";
                            }
                        };
                        let html = jthf.getForm(testJson, options);

                        document.body.innerHTML = html;


                        let test1 = $("fieldset.object > legend + [data-key=''][data-parentKey='']");
                        let test2 = $("fieldset.object > legend + [data-key='two'][data-parentKey='']");
                        let test3 = $("fieldset.object > legend + [data-key='three'][data-parentKey='two']");
                        let test4 = $("fieldset.object > legend + [data-key='four'][data-parentKey='two.three']");

                        expect(test1.length).to.equals(1);
                        expect(test2.length).to.equals(1);
                        expect(test3.length).to.equals(1);
                        expect(test4.length).to.equals(1);
                    });
                });
            });

            describe("The htmlBeforeArray option", function () {
                it("should be possible to add a html string before an array <ul>", function () {
                    let testJson = {
                        "options": "test",
                        "nestedTest": [{
                            "deep": [{
                                "deeper": "yay"
                            }]
                        }]
                    };
                    let options = {
                        htmlBeforeArray: "<p class='htmlBeforeArray'>htmlBeforeArray</p>"
                    };
                    let html = jthf.getForm(testJson, options);

                    document.body.innerHTML = html;

                    let testP1 = $("fieldset.object > fieldset.array > legend + .htmlBeforeArray + ul");
                    let testP2 = $("fieldset.array fieldset.array > legend + .htmlBeforeArray + ul");

                    expect(testP1.length).to.equals(1);
                    expect(testP2.length).to.equals(1);
                });
            });

            /*
                The 'htmlBefore' options:
                It should be possible to supply them as a function that is run every 'before' and that function should get a 'parentkey' and 'key' argument

                Add a 'htmlBeforeLabel' option:
                It should have the same features as the other 'htmlBefore' methods
            */
        });
    });
});