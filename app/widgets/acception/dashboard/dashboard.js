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
      console.log(this.collection);
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

      this.listenTo(this.collection, 'add', function (item, collection) {
        if (DEBUG) {
          console.log(item.id + ' added to collection');
        }
        item.save();
        this.collection.push(item);
      });

      this.listenTo(this.collection, 'remove', function (item, collection) {
        if (DEBUG) {
          console.log(item.id + ' remove from collection');
        }
      });

      this.listenTo(this.collection, 'reset', function () {
        this.collection.each(function (model) {
          model.save();
        });
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
        return false;
      });
    },

    serializeData: function () {
      var data = {};
      if (this.collection && this.collection.totalResults) {
        data = {
          totalResults: this.collection.totalResults,
          items: this.collection.toJSON()
        };
        this.loading = false;
      } else {
        this.loading = true;
      }
      data.loading = this.loading ? true : false;
      return data;
    }
  });
});