define(['backbone.marionette', 'app', 'js/device', 'js/commands', 'js/trans', 'cards/acception/models/collection', 'cards/acception/dashboard/itemview', 'hbs!cards/acception/templates/dashboard'],

function (Marionette, app, device, commands, Trans, Collection, ItemView, template) {
  "use strict";

  return Marionette.CompositeView.extend({
    template: function (data) {
      return template(data);
    },
    itemView: ItemView,
    itemViewContainer: '#acceptions-list',

    appendHtml: function (cv, iv) {
      if (!this.loading) {
        var $container = this.getItemViewContainer(cv);
        $container.append(iv.el);
      }
    },

    hammerOpts: device.options.hammer(),
    initialize: function (options) {
      this.blogId = options.params.blogId;
      this.collection = app.dashboardCardsData.acception = app.dashboardCardsData.acception || new Collection();
      this.loading = true;
      this.settings = options.settings;

      this.trans = null;
      commands.execute('l10n', _.bind(function (l10n) {
        var transId = 'card_' + this.settings.id;
        l10n.load('cards/' + this.settings.id + '/l10n', transId).done(_.bind(function () {
          this.trans = new Trans(l10n, transId);
          if (!this.collection.isSynced) {
            this.render();
            this.fetch(3);
          } else {
            this.loading = false;
            this.render();
          }
        }, this));
      }, this));

      this.$el.hammer(this.hammerOpts).on('tap', '#acceptions-readmore', _.bind(function () {
        var offset = this.collection.length;
        this.moreLoading = true;
        this.render();
        this.fetch(5, offset);
      }, this));

      this.$el.hammer(this.hammerOpts).on('tap', 'a', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var route = $(this).data('route') || '';
        commands.execute('router:navigate', route);
        return false;
      });
    },

    onRender: function () {
      if (this.error) {
        this.$el.find('.refetch').hammer(this.hammerOpts).on('tap', _.bind(function () {
          this.loading = true;
          this.error = false;
          this.render();
          this.fetch();
        }, this));
      }
    },

    fetch: function (limit, offset) {
      this.collection.fetch({
        blogId: this.blogId,
        limit: limit,
        offset: offset,
        merge: true,
        remove: false,
        success: _.bind(function () {
          this.loading = false;
          this.moreLoading = false;
          this.render();
        }, this),
        error: _.bind(function () {
          this.loading = false;
          this.moreLoading = false;
          this.error = true;
          this.render();
        }, this)
      });
    },

    serializeData: function () {
      var data = {};
      if (!this.loading) {
        data.totalResults = parseInt(this.collection.totalResults, 10);
        data.items = this.collection.toJSON();
        if (data.totalResults > this.collection.length) {
          data.showMoreButton = true
        }
      }
      data.moreLoading = this.moreLoading ? true : false;
      data.trans = this.trans;
      data.name = this.settings.name || '';
      data.error = this.error ? true : false;
      data.loading = this.loading ? true : false;
      return data;
    }
  });
});
