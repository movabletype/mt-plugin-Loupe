define(['backbone.marionette', 'app', 'js/device', 'js/commands', 'cards/acception/models/collection', 'cards/acception/dashboard/itemview', 'hbs!cards/acception/templates/dashboard'],

function (Marionette, app, device, commands, Collection, ItemView, template) {
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
      if (!this.collection.isSynced) {
        this.fetch();
      } else {
        this.loading = false;
      }

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

    fetch: function () {
      this.collection.fetch({
        blogId: this.blogId,
        reset: true,
        success: _.bind(function () {
          this.loading = false;
          this.render();
        }, this),
        error: _.bind(function () {
          this.loading = false;
          this.error = true;
          this.render();
        }, this)
      });
    },

    serializeData: function () {
      var data = {};
      if (!this.loading) {
        data.totalResults = this.collection.totalResults;
        data.items = this.collection.toJSON();
      }
      data.error = this.error ? true : false;
      data.loading = this.loading ? true : false;
      return data;
    }
  });
});
