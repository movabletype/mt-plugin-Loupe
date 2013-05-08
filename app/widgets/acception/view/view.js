define(['backbone.marionette', 'backbone.marionette.handlebars', 'app', 'widgets/acception/models/collection', 'widgets/acception/models/model', 'hbs!widgets/acception/templates/view'],

function (Marionette, MarionetteHandlebars, app, Collection, Model, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (model) {
      return template(model);
    },

    initialize: function (params) {
      this.blogId = params.params[0];
      this.entryId = params.params[1];
      if (app.widgetAcceptionCollection) {
        this.collection = app.widgetAcceptionCollection;
      } else {
        this.collection = app.widgetAcceptionCollection = new Collection();
      }

      this.model = this.collection.get(this.entryId);
      if (!this.model) {
        this.model = new Model();
        this.model.fetch({
          blogId: this.blogId,
          entryId: this.entryId
        });
      }

      this.listenTo(this.model, 'sync', _.bind(function () {
        this.render();
        this.collection.set(this.model);
      }, this));
    },

    serializeData: function () {
      var data = {};
      data = this.model.toJSON();
      if (!data.id || data.id !== this.entryId) {
        data = {
          loading: true
        };
      }
      return data;
    }
  });
});