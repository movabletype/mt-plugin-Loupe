define(function () {
  "use strict";

  var L10N = function (userLang) {
    this.userLang = userLang || null;
    this.lexicon = {};
    this.loadCommon();
  };

  L10N.prototype.get = function (namespace, str) {
    return this[namespace] ? this[namespace][str] : null;
  };

  L10N.prototype.load = function (path, namespace) {
    var dfd = $.Deferred();
    if (this.userLang && !this[namespace]) {
      var path = 'json!' + path + '/' + this.userLang + '.json';
      require([path], _.bind(function (lexicon) {
        this[namespace] = lexicon;
        dfd.resolve(this);
      }, this), function (err) {
        console.warn('require failed: ' + path);
        dfd.resolve(this);
      });
    } else {
      dfd.resolve(this);
    }
    return dfd;
  };

  L10N.prototype.loadCommon = function () {
    var dfd = this.loadCommonDfd = $.Deferred();
    if (this.userLang && !this.common) {
      require(['l10n/' + this.userLang + '.js'], _.bind(function (lexicon) {
        this.common = lexicon;
        dfd.resolve(this);
      }, this));
    } else {
      dfd.resolve(this);
    }
    return dfd;
  };

  L10N.prototype.waitLoadCommon = function (callback) {
    if (this.loadCommonDfd) {
      this.loadCommonDfd.done(callback);
    } else {
      this.loadCommon().done(callback);
    }
  }

  return L10N;
});
