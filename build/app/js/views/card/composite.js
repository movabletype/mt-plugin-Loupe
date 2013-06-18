define(['backbone.marionette', 'js/commands', 'js/views/card/itemview'],

function (Marionette, commands, CardItemView) {
  "use strict";

  var cardCompositeViewProto = _.extend(CardItemView.cardItemViewProto, {
    appendHtml: function (cv, iv) {
      if (!this.loading) {
        var $container = this.getItemViewContainer(cv);
        $container.append(iv.el);
      }
    },
    handleReadmore: function (options) {
      this.$el.find('.readmore').hammer(this.hammerOpts).on('tap', _.bind(function () {
        this.loadingReadmore = true;
        this.render();
        this.fetch(options);
      }, this));
    },
    handleItemViewNavigate: function () {
      this.$el.hammer(this.hammerOpts).on('tap', 'a', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var route = $(this).data('route') || '';
        commands.execute('router:navigate', route);
        return false;
      });
    },
    fetch: function (options) {
      var params = {
        merge: true,
        remove: false,
        sort: true,
        success: _.bind(function () {
          this.loading = false;
          this.loadingReadmore = false;
          this.fetchError = false;
          if (options.successCallback) {
            options.successCallback();
          }
          this.render();
        }, this),
        error: _.bind(function () {
          this.loading = false;
          this.loadingReadmore = false;
          this.fetchError = true;
          if (options.errorCallback) {
            options.errorCallback();
          }
          this.render();
        }, this)
      };

      params = _.extend(params, options);
      this.collection.fetch(params);
    }
  });

  return Marionette.CompositeView.extend(cardCompositeViewProto, {
    cardCompositeViewProto: cardCompositeViewProto
  });
});
