define(['backbone', 'js/mtapi'], function (Backbone, mtapi) {
  return Backbone.Model.extend({
    sync: function (method, model, options) {
      if (method === 'read') {
        var dfd = $.Deferred();
        dfd.done(options.success);
        dfd.fail(options.error);
        mtapi.api.getEntry(options.blogId, options.entryId, function (resp) {
          if (!resp.error) {
            dfd.resolve(resp);
          } else {
            dfd.reject(resp);
          }
        });
        return dfd;
      } else if (method === 'update') {
        var dfd = $.Deferred(),
          blogId = model.get('blog').id,
          entryId = model.get('id'),
          entry = model.toJSON();

        dfd.done(options.success);
        dfd.fail(options.error);
        entry.status = options.status || entry.status;

        mtapi.api.updateEntry(blogId, entryId, entry, function (resp) {
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
