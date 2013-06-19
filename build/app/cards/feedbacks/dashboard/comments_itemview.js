define(['backbone.marionette', 'cards/feedbacks/models/comments_model', 'hbs!cards/feedbacks/templates/comments_item_views'],

function (Marionette, Model, template) {
  "use strict";
  return Marionette.ItemView.extend({
    tagName: 'li',
    template: function (data) {
      return template(data);
    }
  });
});