define(['backbone.marionette', 'app', 'js/device', 'js/commands', 'cards/acception/models/collection', 'cards/acception/models/model', 'hbs!cards/acception/templates/view'],

function (Marionette, app, device, commands, Collection, Model, template) {
  "use strict";

  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    },

    ui: {
      button: '#accept-button'
    },

    initialize: function (params) {
      this.blogId = params.params[0];
      this.entryId = params.params[1];
      this.collection = app.dashboardCardsData.acception = app.dashboardCardsData.acception || new Collection();
      this.model = this.collection.get(this.entryId);
      this.loading = true;

      if (this.model) {
        this.loading = false;
      } else {
        this.model = new Model();
        this.model.fetch({
          blogId: this.blogId,
          entryId: this.entryId,
          success: _.bind(function () {
            this.collection.add(this.model);
            this.loading = false;
            this.render();
          }, this),
          error: _.bind(function () {
            this.error = true;
            this.loading = false;
            this.render();
          })
        });
      }
    },

    onRender: function () {

      if (this.acceptionFailed) {
        this.$el.find('.acception-failed .close-me').hammer().on('tap', function () {
          $(this).parent().remove();
        });
      }

      this.ui.button.hammer(device.options.hammer()).on('tap', _.bind(function () {
        this.loading = true;
        this.render();
        var options = {
          success: _.bind(function () {
            if (DEBUG) {
              console.log('acception sccuess');
            }
            this.loading = false;
            this.accepted = true;
            this.collection.remove(this.model);
            this.collection.totalResults = this.collection.totalResults - 1;
            this.render();
          }, this),
          error: _.bind(function () {
            if (DEBUG) {
              console.log('failed acception');
            }
            this.loading = false;
            this.acceptionFailed = true;
            this.render();
          }, this)
        };
        this.model.sync('update', this.model, options);
      }, this));
    },

    serializeData: function () {
      var data = {};
      data = this.model.toJSON();
      data.loading = this.loading ? true : false;
      data.accepted = this.accepted ? true : false;
      data.acceptionFailed = this.acceptionFailed ? true : false;
      return data;
    }
  });
});
