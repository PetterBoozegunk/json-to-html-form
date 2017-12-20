/*jslint
    es6: true, node: true
*/
"use strict";

module.exports = {
    getForm: function (json) {
        let html = "";

        if (json) {
            Object.keys(json).forEach(function (key) {
                html += "<label>";
                html += "<span>" + key + "</span>";
                html += "<input type='text' value='" + json[key] + "'>";
                html += "</label>";
            });
        }

        let rootFs = json ? "<fieldset><legend>Root</legend>" + html + "</fieldset>" : "";
        let formHtml = "<form>" + rootFs + "</form>";

        return formHtml;
    }
};