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
    addHtmlBefore: function (options, name) {
        if (options && options[name]) {
            return options[name];
        }

        return "";
    },
    getKeyId: function (key, parentKey) {
        let keyId = parentKey ? parentKey + "." + key : key;

        return keyId.replace(/^root\./i, "");
    },
    addSimpleKeyValue: function (key, val, parentKey) {
        let html = "";
        let keyId = utils.getKeyId(key, parentKey);

        html += "<label>";
        html += "<span>" + key + "</span>";
        html += "<input type='text' value='" + val + "' name='" + keyId + "'>";
        html += "</label>";

        return html;
    },
    addObjectFieldset: function (key, val, options, parentKey) {
        let html = "<fieldset><legend>" + key + "</legend>";
        let keyId = utils.getKeyId(key, parentKey);

        html += utils.addHtmlBefore(options, "htmlBeforeObject");
        html += utils.getHtml(val, options, keyId);

        html += "</fieldset>";

        return html;
    },
    addArrayUl: function (key, val, options, parentKey) {
        let htmlBeforeArray = utils.addHtmlBefore(options, "htmlBeforeArray");
        let html = "<div class='array'><h2>" + key + "</h2>" + htmlBeforeArray + "<ul>";
        let keyId = utils.getKeyId(key, parentKey);

        val.forEach(function (item, index) {
            let itemKeyId = keyId + "." + index;
            html += "<li>" + utils.getHtml(item, options, itemKeyId) + "</li>";
        });

        html += "</ul></div>";

        return html;
    },
    getHtml: function (obj, options, parentKey) {
        let html = "";

        Object.keys(obj).forEach(function (key) {
            if (utils.isObject(obj[key])) {
                html += utils.addObjectFieldset(key, obj[key], options, parentKey);
            } else if (utils.isArray(obj[key])) {
                html += utils.addArrayUl(key, obj[key], options, parentKey);
            } else {
                html += utils.addSimpleKeyValue(key, obj[key], parentKey);
            }
        });

        return html;
    },
    getFormHtml: function (options, rootHtml) {
        return (options && options.noForm) ? rootHtml : "<form>" + rootHtml + "</form>";
    }
};

module.exports = {
    getForm: function (json, options) {
        let addRoot = {
            "Root": json
        };

        let html = json ? utils.getHtml(addRoot, options, "") : "";

        return utils.getFormHtml(options, html);
    }
};