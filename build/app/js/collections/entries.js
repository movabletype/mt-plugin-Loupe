define(['backbone', 'js/models/entry'], function (Backbone, Model) {
  return Backbone.Collection.extend({
    model: Model
  });
});
