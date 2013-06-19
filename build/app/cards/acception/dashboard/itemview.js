define(['backbone.marionette', 'cards/acception/models/model', 'hbs!cards/acception/templates/dashboard_itemview'],

function (Marionette, Model, template) {
  "use strict";
  return Marionette.ItemView.extend({
    tagName: 'li',
    template: function (data) {
      return template(data);
    }
  });
});