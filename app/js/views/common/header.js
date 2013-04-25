define(['backbone.marionette', 'backbone.marionette.handlebars', 'hbs!js/views/common/template/header'], function (Marionette, MarionetteHandlebars, template) {
  "use strict";

  return Marionette.ItemView.extend({

    template: function (data) {
      return template(data);
    },

    initialize: function (data) {
      this.data = data;
    },

    serializeData: function () {
      return this.data;
    }
  });
});