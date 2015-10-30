var hlib = require('./hlib/hlib');

/**
 * Checks if a token is an identity token (. # [ ])
 * @method isIdentityToken
 * @param {String} t
 * @return {Boolean}
 */
function isIdentityToken(t) {
    return (t === '.' || t === '#' || t === '[' || t === ']');
}

/**
 * Checks if reading class, id or attribute
 * @method sign
 * @param {String} t
 * @return {String} 
 */
function sign(t) {
    return (t === '.' ? 'CLASS' : t === '#' ? 'ID' : t === '[' ? 'ATTR' : false);
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
 * Parses a string into html attributes.
 * @method parseAttrString
 * @param {String} string 
 * @return {Object} An object with tag and attributes keys
 */
function parseAttrString(string) {

    var charLength = string.length,
        temporaryClass = '',
        foundID = 0,
        reading = false,
        helpers = {
            tag: '',
            id: '',
            classes: [],
            other: ''
        },
        final = {
            tag: '',
            attributes: ''
        };

    for (var i = 0, t; t = string[i], i < charLength; i++) {

        if (isIdentityToken(t) && reading !== 'ATTR') {
            reading = sign(t);
        } else if (!reading) {
            helpers.tag += t;
        }

        if (reading === 'CLASS') {
            if (!isIdentityToken(t)) {
                temporaryClass += t;
            } else {
                helpers.classes.push(temporaryClass);
                temporaryClass = '';
            }
        }

        if (reading === 'ID' && foundID <= 1) {
            if (!isIdentityToken(t)) {
                helpers.id += t;
            } else {
                foundID++;
            }
        }

        if (reading === 'ATTR') {
            if (t === ']') {
                reading = false;
            } else if (t !== '[') {
                helpers.other += t;
            }
        }
    }

    if (temporaryClass) helpers.classes.push(temporaryClass);

    final.tag = (helpers.tag) ? helpers.tag : 'div';

    final.attributes += (helpers.id) ? 'id="' + filterCSSName(helpers.id) + '"' : '';

    final.attributes += (helpers.classes.length) ? ' class="' + hlib.uniq(helpers.classes).map(function(el) {
        return filterCSSName(el);
    }).join(' ') + '"' : '';

    final.attributes += (helpers.other) ? ' ' + helpers.other : '';

    return final;

}

var self = module.exports = {
    parseAttrString: parseAttrString,
};