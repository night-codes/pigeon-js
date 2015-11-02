var self = module.exports = {

  isString: function(obj) {
    return (Object.prototype.toString.call(obj) === '[object String]');
  },

  isArray: function(obj) {
    return (Object.prototype.toString.call(obj) === '[object Array]');
  },

  isObj: function(obj) {
    return (Object.prototype.toString.call(obj) === '[object Object]');
  },

  isFunc: function(obj) {
    return (Object.prototype.toString.call(obj) === '[object Function]');
  },

  keys: function(obj) {
    return Object.getOwnPropertyNames(obj);
  },

  uniq: function(obj) {
    var seen = {};
    return obj.filter(function(el) {
      if (seen[el]) {
        return;
      }
      seen[el] = true;
      return el;
    });
  },
};
