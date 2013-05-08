define(['backbone.marionette', 'backbone.marionette.handlebars', 'app', 'widgets/acception/models/collection', 'widgets/acception/models/model', 'hbs!widgets/acception/templates/view'],

function (Marionette, MarionetteHandlebars, app, Collection, Model, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (model) {
      return template(model);
    },

    ui: {
      button: '#accept-button'
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
        this.loading = false;
        this.render();
        console.log(this.collection)
        this.collection.push(this.model);
        console.log(this.collection)
      }, this));

      this.$el.hammer().on('touch', '#accept-button', _.bind(function () {
        this.ui.button.addClass('tapped');
      }, this));

      this.$el.hammer().on('release', '#accept-button', _.bind(function () {
        this.ui.button.removeClass('tapped');
      }, this));

      this.$el.hammer().on('tap', '#accept-button', _.bind(function () {
        this.loading = true;
        this.render();
        var options = {
          success: _.bind(function () {
            if (DEBUG) {
              console.log('manipulating acception sccuessfully')
            }
            this.model.save();
            this.loading = false;
            this.accepted = true;
            this.render();
          }, this)
        }
        this.model.publish(options)
      }, this));

    },

    serializeData: function () {
      var data = {};
      data = this.model.toJSON();
      if (!data.id || data.id !== this.entryId) {
        data = {};
        this.loading = true;
      }
      data.loading = this.loading ? true : false;
      data.accepted = this.accepted ? true : false;
      return data;
    }
  });
});