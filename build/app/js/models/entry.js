define(['backbone', 'js/mtapi'], function (Backbone, mtapi) {
  return Backbone.Model.extend({
    initialize: function (options) {
      this.blogId = options.blogId;
    },
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);
        mtapi.api.getEntry(this.blogId, this.id, {
          fields: 'author,blog,categories,id,status,title,body,permalink,date,excerpt'
        }, function (resp) {
          if (!resp.error) {
            dfd.resolve(resp);
          } else {
            dfd.reject(resp);
          }
        });
        return dfd;
      }
    }
  });
});
