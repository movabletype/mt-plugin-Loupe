define(['backbone.marionette', 'widgets/stats/models/top_articles_itemview', 'hbs!widgets/stats/templates/top_articles_itemview'],

function (Marionette, Model, template) {
  "use strict";
  return Marionette.ItemView.extend({
    template: function (data) {
      return template(data);
    }
  });
});