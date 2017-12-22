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
    removeRootFromKey: function (key) {
        let keyStr = key || "";

        return keyStr.replace(/^root(\.)?/i, "");
    },
    getKeyId: function (key, parentKey) {
        let keyId = parentKey ? parentKey + "." + key : key;

        return utils.removeRootFromKey(keyId);
    },
    getBeforeHtmlFromFunction: function (options, name, key, parentKey) {
        let keyId = utils.removeRootFromKey(parentKey);
        let noRootKey = utils.removeRootFromKey(key);

        return options[name](noRootKey, keyId);
    },
    getHtmlBefore: function (options, name, key, parentKey) {
        return (typeof options[name] === "function") ?
            utils.getBeforeHtmlFromFunction(options, name, key, parentKey) :
            options[name];
    },
    addHtmlBefore: function (options, name, key, parentKey) {
        if (options && options[name]) {
            return utils.getHtmlBefore(options, name, key, parentKey);
        }

        return "";
    },
    getTextValueElem: function (val, keyId) {
        return (typeof val === "string" && val.length >= 30) ?
            "<textarea name=\"" + keyId + "\">" + val + "</textarea>" :
            "<input type=\"text\" value=\"" + val + "\" name=\"" + keyId + "\">";
    },
    addSimpleKeyValue: function (key, val, parentKey) {
        let html = "";
        let keyId = utils.getKeyId(key, parentKey);

        html += "<label>";
        html += "<span>" + key + "</span>";
        html += utils.getTextValueElem(val, keyId);
        html += "</label>";

        return html;
    },
    addObjectFieldset: function (key, val, options, parentKey) {
        let html = "<fieldset class=\"object\"><legend>" + key + "</legend>";
        let keyId = utils.getKeyId(key, parentKey);

        html += utils.addHtmlBefore(options, "htmlBeforeObject", key, parentKey);
        html += utils.getHtml(val, options, keyId);

        html += "</fieldset>";

        return html;
    },
    addArrayFieldset: function (key, val, options, parentKey) {
        let htmlBeforeArray = utils.addHtmlBefore(options, "htmlBeforeArray", key, parentKey);
        let html = "<fieldset class=\"array\"><legend>" + key + "</legend>" + htmlBeforeArray + "<ul>";
        let keyId = utils.getKeyId(key, parentKey);

        val.forEach(function (item, index) {
            let itemKeyId = keyId + "." + index;
            html += "<li>" + utils.getHtml(item, options, itemKeyId) + "</li>";
        });

        html += "</ul></fieldset>";

        return html;
    },
    getHtml: function (obj, options, parentKey) {
        let html = "";

        Object.keys(obj).forEach(function (key) {
            if (utils.isObject(obj[key])) {
                html += utils.addObjectFieldset(key, obj[key], options, parentKey);
            } else if (utils.isArray(obj[key])) {
                html += utils.addArrayFieldset(key, obj[key], options, parentKey);
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
            "root": json
        };

        let html = json ? utils.getHtml(addRoot, options, "") : "";

        return utils.getFormHtml(options, html);
    }
};