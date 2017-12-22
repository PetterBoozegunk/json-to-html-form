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
    setLegend: function (key, options) {
        let customHtml = (options && options.htmlAfterLegendText) ?
            options.htmlAfterLegendText :
            "";

        return "<legend>" + key + customHtml + "</legend>";
    },
    addSimpleKeyValue: function (key, val, options, parentKey) {
        let html = "";
        let keyId = utils.getKeyId(key, parentKey);

        html += "<label>";
        html += utils.addHtmlBefore(options, "htmlBeforeLabel", key, parentKey);
        html += "<span>" + key + "</span>";
        html += utils.getTextValueElem(val, keyId);
        html += "</label>";

        return html;
    },
    addObjectFieldset: function (key, val, options, parentKey) {
        let html = "<fieldset class=\"object\">";
        let keyId = utils.getKeyId(key, parentKey);

        html += utils.setLegend(key, options);
        html += utils.addHtmlBefore(options, "htmlBeforeObject", key, parentKey);
        html += utils.getHtml(val, options, keyId);

        html += "</fieldset>";

        return html;
    },
    arrayLiItemMethods: {
        object: function (item, ignore, itemKeyId, options) {
            return utils.getHtml(item, options, itemKeyId);
        },
        array: function (item, key, itemKeyId, options) {
            if (itemKeyId === key) {
                itemKeyId = "";
            }

            return utils.addArrayFieldset(key, item, options, itemKeyId);
        },
        defaultMethod: function (item, ignore, itemKeyId) {
            return utils.getTextValueElem(item, itemKeyId);
        }
    },
    getItemType: function (item) {
        let type = "defaultType";

        if (utils.isObject(item)) {
            type = "object";
        } else if (utils.isArray(item)) {
            type = "array";
        }

        return type;
    },
    addItemToArrayLi: function (item, key, itemKeyId, options) {
        let itemType = utils.getItemType(item);
        let addItemMethod = utils.arrayLiItemMethods[itemType] || utils.arrayLiItemMethods.defaultMethod;

        return addItemMethod(item, key, itemKeyId, options);
    },
    addArrayFieldset: function (key, val, options, parentKey) {
        let htmlBeforeArray = utils.addHtmlBefore(options, "htmlBeforeArray", key, parentKey);
        let html = "<fieldset class=\"array\">" + utils.setLegend(key, options) + htmlBeforeArray + "<ol>";
        let keyId = utils.getKeyId(key, parentKey);

        val.forEach(function (item, index) {
            let itemKeyId = keyId + "." + index;
            html += "<li>" + utils.addItemToArrayLi(item, key + "." + index, itemKeyId, options) + "</li>";
        });

        html += "</ol></fieldset>";

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
                html += utils.addSimpleKeyValue(key, obj[key], options, parentKey);
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