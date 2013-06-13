define(function () {
  'use strict';

  var cache = {}
  return {
    get: function (name) {
      return cache[name];
    },
    set: function (name, value) {
      cache[name] = value;
      return cache[name];
    },
    clear: function () {
      cache = {};
    }
  };
});
