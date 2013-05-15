define(['backbone.marionette', 'backbone.marionette.handlebars', 'widgets/acception/models/model', 'hbs!widgets/acception/templates/dashboard_itemview'],

function (Marionette, MarionetteHandlebars, Model, template) {
  "use strict";
  return Marionette.ItemView.extend({
    tagName: 'li',
    template: function (data) {
      return template(data);
    }
  });
});