define(['backbone.marionette', 'backbone.marionette.handlebars', 'app', 'js/commands', 'widgets/acception/models/collection', 'widgets/acception/dashboard/itemview', 'hbs!widgets/acception/templates/dashboard'],

function (Marionette, MarionetteHandlebars, app, commands, Collection, ItemView, template) {
  "use strict";

  return Marionette.CompositeView.extend({
    template: function (items) {
      return template(items);
    },

    itemView: ItemView,
    itemViewContainer: '#acceptions-list',


    initialize: function (options) {
      this.blogId = options.params.blogId;
      this.collection = app.widgetAcceptionCollection;
      if (this.collection) {
        this.collection.fetch({
          blogId: this.blogId,
          sort: true
        });
      } else {
        this.collection = app.widgetAcceptionCollection = new Collection();
        this.collection.fetch({
          reset: true,
          blogId: this.blogId
        });
      }

      this.listenTo(this.collection, 'add', function (item, collection, options) {
        item.save();
      })

      this.listenTo(this.collection, 'reset', function () {
        this.collection.each(function (model) {
          model.save();
        })
      });

      this.listenTo(this.collection, 'sync', function () {
        this.collection.sort();
        this.render();
      });

      this.$el.hammer().on('tap', 'a', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var route = $(this).data('route') || '';
        commands.execute('router:navigate', route);
        false;
      })
    },

    serializeData: function () {
      var data = {};
      if (this.collection && this.collection.totalResults) {
        data = {
          totalResults: this.collection.totalResults,
          items: this.collection.toJSON()
        };
      } else {
        data = {
          loading: true
        };
      }
      return data;
    }
  });
});