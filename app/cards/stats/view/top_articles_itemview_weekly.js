define(['backbone.marionette', 'cards/stats/models/top_articles_itemview', 'hbs!cards/stats/templates/top_articles_itemview_weekly'],

function (Marionette, Model, template) {
  "use strict";
  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    }
  });
});