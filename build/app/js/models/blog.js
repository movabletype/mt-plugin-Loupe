define(['backbone', 'js/mtapi/blog'], function (Backbone, getBlog) {
  return Backbone.Model.extend({
    sync: function (method) {
      if (method === 'read') {
        return getBlog(this.id);
      }
    }
  });
});
