'use strict';

var pigeon = require('./lib/pigeon'),
    beautifyHTML = require('js-beautify').html;

module.exports = function(obj, callback, options) {

    var callback = callback || function() {},
        options = options || {};

    if (obj !== null && typeof obj !== 'object') {
        var error = new TypeError('Expected an object.');
        callback(error, null);
        return;
    }

    var html = pigeon.build(obj);

    if (!options.minify) {
        html = beautifyHTML(html, {
            indent_size: options.indentSize || 4
        });
    }

    callback(null, html);

    return html;

};