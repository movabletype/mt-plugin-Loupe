define(['backbone.marionette', 'app', 'js/commands', 'widgets/acception/models/collection', 'widgets/acception/dashboard/itemview', 'hbs!widgets/acception/templates/dashboard'],

function (Marionette, app, commands, collection, ItemView, template) {
  "use strict";

  return Marionette.CompositeView.extend({
    template: function (data) {
      return template(data);
    },
    itemView: ItemView,
    itemViewContainer: '#acceptions-list',

    initialize: function (options) {
      this.blogId = options.params.blogId;
      this.collection = collection;
      this.loading = true;
      if (!this.collection.isSynced) {
        this.fetch();
      } else {
        this.loading = false;
      }

      this.$el.hammer().on('tap', 'a', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var route = $(this).data('route') || '';
        commands.execute('router:navigate', route);
        return false;
      });

      this.$el.hammer().on('tap', '.refetch', _.bind(function () {
        this.loading = true;
        this.error = false;
        this.render();
        this.fetch();
      }, this));
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
