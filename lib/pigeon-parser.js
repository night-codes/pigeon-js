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

    var charLength = string.length;
    var temporaryClass = '';
    var foundID = 0;
    var reading = false;
        
    var helpers = {
            tag: '',
            id: '',
            classes: [],
            other: ''
    };
        
    var final = {
            tag: '',
            attributes: ''
    };

    for (var i = 0, t; t = string[i], i < charLength; i++) {

        if (isIdentityToken(t) && reading !== 'ATTR') {
            reading = sign(t);
        }

        switch (reading) {
            case 'CLASS':
                if (!isIdentityToken(t)) {
                    temporaryClass += t;
                } else {
                    helpers.classes.push(temporaryClass);
                    temporaryClass = '';
                }
                break;

            case 'ID':
                if (!isIdentityToken(t) && foundID <= 1) {
                    helpers.id += t;
                } else {
                    foundID++;
                }
                break;
            case 'ATTR':
                if (t === ']') {
                    reading = false;
                } else if (t !== '[') {
                    helpers.other += t;
                }
                break;
            case false:
                helpers.tag += t;
                break;
        }
    }

    if (temporaryClass) {
        helpers.classes.push(temporaryClass);
    }
    
    helpers.id = filterCSSName(helpers.id);
    helpers.classes = hlib.uniq(helpers.classes)
                        .map(function(el) {
                            return filterCSSName(el);
                        })
                        .join(' ');
                        

    final.tag = (helpers.tag) 
        ? helpers.tag 
        : 'div';

    final.attributes += (helpers.id) 
        ? 'id="' + helpers.id + '"' 
        : '';

    final.attributes += (helpers.classes.length) 
        ? ' class="' + helpers.classes + '"' 
        : '';

    final.attributes += (helpers.other) 
        ? ' ' + helpers.other 
        : '';

    return final;

}

var self = module.exports = {
    parseAttrString: parseAttrString,
};
