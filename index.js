/*jslint
    es6: true, node: true
*/
"use strict";
let utils;

utils = {
    isObject: function (val) {
        return (typeof val === "object" && val !== null && !Array.isArray(val));
    },
    isArray: function (val) {
        return Array.isArray(val);
    },
    addSimpleKeyValue: function (key, val) {
        let html = "";

        html += "<label>";
        html += "<span>" + key + "</span>";
        html += "<input type='text' value='" + val + "'>";
        html += "</label>";

        return html;
    },
    addHtmlBefore: function (options, name) {
        if (options && options[name]) {
            return options[name];
        }

        return "";
    },
    addObjectFieldset: function (key, val, options) {
        let html = "<fieldset><legend>" + key + "</legend>";

        html += utils.addHtmlBefore(options, "htmlBeforeObject");
        html += utils.getHtml(val, options);

        html += "</fieldset>";

        return html;
    },
    addArrayUl: function (key, val, options) {
        let htmlBeforeArray = utils.addHtmlBefore(options, "htmlBeforeArray");
        let html = "<div class='array'><h2>" + key + "</h2>" + htmlBeforeArray + "<ul>";

        val.forEach(function (item) {
            html += "<li>" + utils.getHtml(item, options) + "</li>";
        });

        html += "</ul></div>";

        return html;
    },
    getHtml: function (obj, options) {
        let html = "";

        Object.keys(obj).forEach(function (key) {
            if (utils.isObject(obj[key])) {
                html += utils.addObjectFieldset(key, obj[key], options);
            } else if (utils.isArray(obj[key])) {
                html += utils.addArrayUl(key, obj[key], options);
            } else {
                html += utils.addSimpleKeyValue(key, obj[key]);
            }
        });

        return html;
    },
    getFormHtml: function (options, rootFs) {
        return (options && options.noForm) ? rootFs : "<form>" + rootFs + "</form>";
    }
};

module.exports = {
    getForm: function (json, options) {
        let addRoot = {
            "Root": json
        };

        let rootFs = json ? utils.getHtml(addRoot, options) : "";

        return utils.getFormHtml(options, rootFs);
    }
};