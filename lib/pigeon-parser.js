var hlib = require('./hlib/hlib');

/**
 * Checks if a token is an identity token (. # [ ])
 * @param {String} t Token
 * @return {Boolean}
 */
function isIdentityToken(t) {
  return (t === '.' || t === '#' || t === '[' || t === ']');
}

/**
 * Checks if reading class, id or attribute
 * @param {String} t Token
 * @return {String} 
 */
function sign(t) {
  return (t === '.' ? 0 : t === '#' ? 1 : t === '[' ? 2 : false);
}

/**
 * Remove's illegal characters from CSS identifiers.
 * @param {String} CSS identifier
 * @return {String} CSS identifier without illegal characters
 */
function filterCSSName(string) {
  return string.replace(/^[^a-zA-Z]+|[^\w:.-]+/g, '');
}

/**
 * Parses a string into html attributes.
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

    var idenToken = isIdentityToken(t);

    if (idenToken && reading !== 2) {
      reading = sign(t);
    }

    switch (reading) {
      case 0:
        if (!idenToken) {
          temporaryClass += t;
        } else {
          helpers.classes.push(temporaryClass);
          temporaryClass = '';
        }
        break;
      case 1:
        if (!idenToken && foundID <= 1) {
          helpers.id += t;
        } else {
          foundID++;
        }
        break;
      case 2:
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

  final.tag = (helpers.tag) ? helpers.tag : 'div';

  final.attributes += (helpers.id) ? 'id="' + helpers.id + '"' : '';

  final.attributes += (helpers.classes.length) ? ' class="' + helpers.classes + '"' : '';

  final.attributes += (helpers.other) ? ' ' + helpers.other : '';

  return final;

}

var self = module.exports = {
  parseAttrString: parseAttrString,
};