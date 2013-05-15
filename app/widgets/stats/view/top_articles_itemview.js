define(['backbone.marionette', 'backbone.marionette.handlebars', 'widgets/stats/models/top_articles_itemview', 'hbs!widgets/stats/templates/top_articles_itemview'],

function (Marionette, MarionetteHandlebars, Model, template) {
  "use strict";
  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    }
  });
});