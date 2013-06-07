define(['backbone', 'js/mtapi', 'cards/feedbacks/models/comments_entry_model'], function (Backbone, mtapi, Model) {
  return Backbone.Collection.extend({
    model: Model
  });
});
