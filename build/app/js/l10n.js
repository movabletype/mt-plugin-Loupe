define(function () {
  "use strict";

  var L10N = function (userLang) {
    this.libPath = $('#main-script').data('base') || '.';
    this.userLang = userLang || $('#main-script').data('default-language') || 'en-us';
    this.lexicon = {};
    this.loadCommon();
  };

  L10N.prototype.get = function (namespace, str) {
    return this[namespace] ? this[namespace][str] : null;
  };

  L10N.prototype.load = function (path, namespace) {
    var dfd = $.Deferred();
    if (this.userLang && !this[namespace]) {
      path = 'json!' + path + '/' + this.userLang + '.json';
      require([path], _.bind(function (lexicon) {
        this[namespace] = lexicon;
        dfd.resolve(this);
      }, this), _.bind(function (err) {
        if (DEBUG) {
          console.log('require failed: ' + path);
          console.log(err);
        }
        this[namespace] = {};
        dfd.resolve(this);
      }, this));
    } else {
      dfd.resolve(this);
    }
    return dfd;
  };

  L10N.prototype.loadCommon = function () {
    var dfd = this.loadCommonDfd = $.Deferred();

    var finalize = _.bind(function (lexicon) {
      this.common = lexicon;
      dfd.resolve(this);
    }, this);

    var errorHandler = _.bind(function () {
      if (DEBUG) {
        console.log('error occurred in loading common l10n file (user language is ' + this.userLang + '), so load as en-us instead');
      }
      this.userLang = 'en-us';
      loadCommonL10N();
    }, this);

    var loadCommonL10N = _.bind(function (err) {
      if (window.basket !== undefined && window.buildTime !== undefined) {
        basket.require({
          url: this.libPath + '/js/l10n/' + this.userLang + '.js',
          unique: window.buildTime
        }).then(_.bind(function () {
          require(['json!l10n/' + this.userLang + '.json'], finalize, err);
        }, this), err);
      } else {
        require(['json!l10n/' + this.userLang + '.json'], finalize, err);
      }
    }, this);

    if (this.userLang && !this.common) {
      loadCommonL10N(errorHandler);
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
  };

  return L10N;
});
