define(function () {
  'use strict';

  var cache = {};
  return {
    get: function (id, key) {
      return cache[id] ? cache[id][key] : null;
    },
    set: function (id, key, value) {
      cache[id] = cache[id] || {};
      cache[id][key] = value;
      return cache[id][key];
    },
    clear: function (id, key) {
      if (!key) {
        delete cache[id];
      } else {
        delete cache[id][key];
      }
    },
    clearAll: function () {
      cache = {};
    }
  };
});
