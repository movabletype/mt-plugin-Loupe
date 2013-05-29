define(['jquery', 'backbone', 'js/mtapi/blog'], function ($, Backbone, getBlog) {
  return Backbone.Model.extend({
    sync: function (method, model, options) {
      if (method === 'read') {
        return getBlog(this.id);
      }
    }
  });
});
