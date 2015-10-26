var hlib = require('./hlib/hlib');

/**
 * Parses the attribute string into html attributes.
 * @method parseAttrString
 * @param {String} attrString 
 * @return {Object} An object with tag and attributes keys
 */

/**
 * Parses the attribute string into html attributes.
 * @method parseAttrString
 * @param {String} attrString 
 * @return {Object} An object with tag and attributes keys
 */

function parseAttrString(attrString) {

    var al = attrString.length,
        temporaryClass = '',
        foundID = 0,
        reading = {
            cls: false,
            id: false,
            attribute: false
        },
        helpers = {
            id: '',
            classes: [],
            other: ''
        },
        final = {
            tag: '',
            attributes: ''
        };

    for (var i = 0, t; t = attrString[i], i < al; i++) {

        if (t === '.' && !reading.attribute) {
            reading.cls = true;
            reading.id = reading.attribute = false;
        }

        if (t === '#' && !reading.attribute) {
            reading.id = true;
            reading.cls = reading.attribute = false;
        }

        if (t === '[' && !reading.attribute) {
            reading.attribute = true;
            reading.cls = reading.id = false;
        }

        if (reading.cls) {
            if (!isIdentityToken(t)) {
                temporaryClass += t;
            } else {
                helpers.classes.push(temporaryClass);
                temporaryClass = '';
            }
        }

        // Stop at the first found ID
        if (reading.id && foundID <= 1) {
            if (!isIdentityToken(t)) {
                helpers.id += t;
            } else {
                foundID++;
            }
        }

        if (reading.attribute) {
            if (t === ']') {
                reading.attribute = false;
            } else {
                if (t !== '[') {
                    helpers.other += t;
                }
            }
        }

        if (!reading.attribute && !reading.cls && !reading.id && t !== ']') {
            final.tag += t;
        }

    }

    if (!final.tag) final.tag = 'div';

    // Push last class name 
    if (temporaryClass) helpers.classes.push(temporaryClass);

    helpers.classes = hlib.uniq(helpers.classes);
    helpers.classes = helpers.classes.map(function(el) {
        return filterCSSName(el);
    });
    helpers.id = filterCSSName(helpers.id);

    if (helpers.id) {
        final.attributes += 'id="' + helpers.id + '"';
    }

    if (helpers.classes.length) {
        final.attributes += ' class="' + helpers.classes.join(' ') + '"';
    }

    if (helpers.other) {
        final.attributes += ' ' + helpers.other;
    }

    return final;

}

/**
 * Remove's illegal characters from CSS identifiers.
 * @method filterCSSName
 * @param {String} CSS identifier
 * @return {String} CSS identifier without illegal characters
 */
function filterCSSName(string) {
    return string.replace(/^[^a-zA-Z]+|[^\w:.-]+/g, '');
}

/**
 * Checks to see if a token is an identity token (. # [ ])
 * @method isIdentityToken
 * @param {String} token
 * @return {Boolean}
 */
function isIdentityToken(token) {
    return (token === '.' || token === '#' || token === '[' || token === ']');
}

var self = module.exports = {
    parseAttrString: parseAttrString,
};
