define(['backbone', 'js/mtapi/blog'], function (Backbone, getBlog) {
  return Backbone.Model.extend({
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = getBlog(this.id, {
          fields: 'id,name,class,url'
        });
        dfd.done(options.success);
        dfd.fail(options.error);
        return dfd;
      }
    }
  });
});
