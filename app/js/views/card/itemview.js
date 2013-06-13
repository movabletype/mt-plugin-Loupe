define(['backbone.marionette', 'js/commands', 'js/device', 'js/trans'],

function (Marionette, commands, device, Trans) {
  "use strict";

  var cardItemViewProto = {
    initialize: function (options) {
      var params = options.params;
      this.blogId = params.blogId;
      this.blog = params.blog;
      this.user = params.user;
      this.userId = params.userId;
      this.settings = options.settings;
      this.loading = true;
      this.trans = null;
      this.hammerOpts = device.options.hammer();
    },
    setTranslation: function (callback) {
      // render after finished set up translation
      commands.execute('l10n', _.bind(function (l10n) {
        var name = 'card_' + this.settings.id
        this.l10n = l10n;
        l10n.load('cards/' + this.settings.id + '/l10n', name).done(_.bind(function () {
          this.trans = new Trans(l10n, name);
          if (callback) {
            callback();
          } else {
            this.render();
          }
        }, this));
      }, this));
    },
    handleRefetch: function (options) {
      if (this.fetchError) {
        this.$el.find('.refetch').hammer(this.hammerOpts).one('tap', _.bind(function () {
          this.loading = true;
          this.fetchError = false;
          this.render();
          this.fetch(options);
        }, this));
      }
    },
    fetch: function (options) {
      var params = {
        success: _.bind(function () {
          this.loading = false;
          this.fetchError = false;
          if (options.successCallback) {
            options.successCallback();
          }
          this.render();
        }, this),
        error: _.bind(function () {
          this.loading = false;
          this.fetchError = true;
          if (options.errorCallback) {
            options.errorCallback();
          }
          this.render();
        }, this)
      };

      params = _.extend(params, options);

      this.model.fetch(params);
    },
    serializeDataInitialize: function () {
      var data = {}
      if (this.l10n) {
        var lang = this.l10n.userLang.split('-');
        if (lang === 'us') {
          lang = ''
        }
        data.lang = lang;
      }
      data.name = this.settings.id;
      data.fetchError = this.fetchError;
      data.loading = this.loading;
      data.loadingReadmore = this.loadingReadmore;
      data.trans = this.trans;
      return data;
    }
  };

  return Marionette.ItemView.extend(cardItemViewProto, {
    cardItemViewProto: cardItemViewProto
  });
});
