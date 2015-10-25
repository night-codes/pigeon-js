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
        var keys = [];
        for (var key in obj) {
            keys.push(key);
        }
        return keys;
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
