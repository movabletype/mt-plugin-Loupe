define(['backbone', 'js/models/perm'], function (Backbone, Model) {
  return Backbone.Collection.extend({
    model: Model,
    parse: function (resp) {
      return _.map(resp, function (res) {
        return {
          id: res.blog.id,
          permissions: res.permissions
        };
      });
    }
  });
});
