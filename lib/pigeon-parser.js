var hlib = require('./hlib/hlib');

/**
 * Parses the attribute string into html attributes.
 * @method parseAttrString
 * @param {String} attrString 
 * @return {Object} An object with tag and attributes keys
 */

function parseAttrString(attrString) {

    if (!attrString) {
        return {
            tag: 'div',
            attributes: ''
        };
    }
    
    if (!/(#|\.|\[|\])/g.test(attrString)) {
        return {
            tag: attrString,
            attributes: ''
        };
    }

    var al = attrString.length,
        tag = '', id = '',
        fstring = '',
        fclasses,
        classes = [],
        other = '',
        tmpClassName = '',
        foundID = 0,
        readingID = false,
        readingClass = false,
        readingAttribute = false;


    for (var i = 0, t; t = attrString[i], i < al; i++) {

        if (t === '.' && !readingAttribute) {
            readingClass = true;
            readingID = readingAttribute = false;
        }

        if (t === '#' && !readingAttribute) {
            readingID = true;
            readingClass = readingAttribute = false;
        }

        if (t === '[' && !readingAttribute) {
            readingAttribute = true;
            readingClass = readingID = false;
        }

        /* DEBUG
            console.log('Index: ' + i);
            console.log('Attribute: ' + readingAttribute);
            console.log('Class: ' + readingClass);
            console.log('ID: ' + readingID);
        */

        if (readingClass) {
            if (!isIdentityToken(t)) {
                tmpClassName += t;
            } else {
                classes.push(tmpClassName);
                tmpClassName = '';
            }
        }

        // Stop at the first found ID
        if (readingID && foundID <= 1) {
            if (!isIdentityToken(t)) {
                id += t;
            } else {
                foundID++;
            }
        }

        if (readingAttribute) {
            if (t === ']') {
                readingAttribute = false;
            } else {
                if (t !== '[') {
                    other += t;
                }
            }
        }
        
        if (!readingAttribute && !readingClass && !readingID && t !== ']') {
            tag += t;
        }

    }
    
    if (!tag) tag = 'div';

    // Push last class name 
    if (tmpClassName) classes.push(tmpClassName);

    classes = hlib.uniq(classes);
    fclasses = classes.map(function(el) {
        return filterCSSName(el);
    });
    id = filterCSSName(id);

    if (id) {
        fstring += 'id="' + id + '"';
    }

    if (fclasses.length) {
        fstring += ' class="' + fclasses.join(' ') + '"';
    }

    if (other) {
        fstring += ' ' + other;
    }

    return {
        tag: tag,
        attributes: fstring
    };

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
