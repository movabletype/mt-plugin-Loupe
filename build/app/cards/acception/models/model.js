define(['backbone', 'js/mtapi'], function (Backbone, mtapi) {
  return Backbone.Model.extend({
    sync: function (method, model, options) {
      var dfd = $.Deferred(),
        blogId = options.blogId,
        callback = function (resp) {
          if (!resp.error) {
            dfd.resolve(resp);
          } else {
            dfd.reject(resp);
          }
        };

      dfd.done(options.success);
      dfd.fail(options.error);

      if (method === 'read') {
        mtapi.api.getEntry(blogId, this.id, callback);
      } else if (method === 'update') {
        var entry = model.toJSON();
        entry.status = options.status || entry.status;
        mtapi.api.updateEntry(blogId, this.id, entry, callback);
      }

      return dfd;
    }
  });
});
