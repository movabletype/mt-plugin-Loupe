define(['backbone.marionette', 'js/cache', 'js/commands', 'js/device', 'js/trans'], function (Marionette, cache, commands, device, Trans) {

  "use strict";

  var cardItemViewProto = {
    initialize: function (options) {
      options = options || {};
      this.blogId = options.blogId;
      this.blog = options.blog;
      this.user = options.user;
      this.userId = options.userId;
      this.card = options.card;
      this.loading = true;
      this.trans = null;
      this.hammerOpts = device.options.hammer();
      var permsList = cache.get('user', 'perms');
      this.perms = (permsList && permsList.get(this.blogId)) ? permsList.get(this.blogId).get('permissions') : null;
    },
    permissionCheck: function (target, perms) {
      if (perms) {
        var i, len = perms.length;
        for (i = 0; i < len; i++) {
          if (perms[i] === target) {
            return true;
          }
        }
        return false;
      } else {
        return false;
      }
    },
    userHasPermission: function (target) {
      return this.permissionCheck(target, this.perms);
    },
    userHasSystemPermission: function (target) {
      return this.permissionCheck(target, this.user.permissions);
    },
    userIsSystemAdmin: function () {
      return this.userHasSystemPermission('administer');
    },
    dashboardShowWithPermission: function (perm) {
      var dfd = $.Deferred(),
        $root = $('#card-' + this.card.id);

      if (perm) {
        $root.show();
        dfd.resolve();
      } else {
        $root.hide();
        dfd.reject();
      }
      return dfd;
    },
    setTranslation: function (callback) {
      // render after finished set up translation
      commands.execute('l10n', _.bind(function (l10n) {
        var name = 'card_' + this.card.id;
        this.l10n = l10n;
        l10n.load('cards/' + this.card.id + '/l10n', name).done(_.bind(function () {
          this.trans = new Trans(l10n, name);
          if (callback) {
            callback();
          } else {
            this.render();
          }
        }, this));
      }, this));
    },
    addTapClass: function (el, callback) {
      var $el = $(el);
      $el.addClass('tapped');
      setTimeout(function () {
        if (callback) {
          callback();
        }
      }, 100);
      setTimeout(function () {
        $el.removeClass('tapped');
      }, 300);
    },
    handleRefetch: function (options) {
      if (this.fetchError) {
        this.$el.hammer(this.hammerOpts).on('tap', '.refetch', _.bind(function (e) {
          this.addTapClass(e.currentTarget, _.bind(function () {
            this.loading = true;
            this.fetchError = false;
            this.render();
            this.fetch(options);
          }, this));
        }, this));
      }
    },
    fetch: function (options) {
      options = options || {};
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
      var data = {};
      if (this.l10n) {
        var lang = this.l10n.userLang ? this.l10n.userLang : '';
        if (lang === 'en-us') {
          lang = '';
        }
        data.lang = lang;
      }
      data.name = this.card.name;
      data.id = this.card.id;
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
